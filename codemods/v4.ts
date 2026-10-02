/**
 * Migrates code that uses ReactPlayer v3 to v4. See the "Migrating to v4.0" section of MIGRATING.md.
 *
 *   npx jscodeshift --extensions=js,jsx,ts,tsx -t <path or URL to this file> src
 *
 * It rewrites what can be rewritten safely:
 *
 * - `<ReactPlayer ref={...}>` => `<ReactPlayer mediaRef={...}>`, and `ref.current.api` => `ref.current.engine`
 * - `config` keys: `hls` => `hlsJs`, `dash` => `dashJs`, `html` removed, and the new Spotify, TikTok and Twitch values
 * - `react-player/patterns`: `canPlay.youtube(url)` => `canPlay('youtube')(url)`, `MATCH_URL_YOUTUBE.test(url)` =>
 *   `canPlay('youtube')(url)`, and a local copy of any removed regex that is used some other way
 * - `name` removed from custom player entries
 *
 * Anything that needs a decision is left as a `TODO(react-player v4)` comment and reported in the output.
 */
import type { API, ASTPath, Collection, FileInfo, JSCodeshift } from 'jscodeshift';

// Parses JavaScript, JSX, TypeScript and TSX, so the transform works without `--parser`.
export const parser = 'tsx';

// The AST is a mix of Babel and ESTree node types depending on the parser, so nodes are handled structurally.
// oxlint-disable-next-line typescript/no-explicit-any
type AnyNode = any;

const TODO = 'TODO(react-player v4):';

const RENAMED_CONFIG_KEYS: Record<string, string> = { hls: 'hlsJs', dash: 'dashJs' };
const MUX_SOURCE_KEYS = new Set(['playback', 'poster', 'storyboard', 'drm']);
const TIKTOK_FLAGS = new Set([
  'closed_caption',
  'description',
  'fullscreen_button',
  'music_info',
  'native_context_menu',
  'play_button',
  'progress_bar',
  'rel',
  'timestamp',
  'volume_control',
]);

/** Members of the v3 `ref` that only a DOM element has. In v4 `mediaRef` is not an element for embeds. */
const DOM_ONLY_MEMBERS = new Set([
  'classList',
  'closest',
  'contains',
  'focus',
  'getAttribute',
  'getBoundingClientRect',
  'parentElement',
  'parentNode',
  'querySelector',
  'querySelectorAll',
  'requestFullscreen',
  'scrollIntoView',
  'setAttribute',
  'style',
  'webkitEnterFullscreen',
  'webkitRequestFullscreen',
]);

/** The regexes v3 exported from `react-player/patterns`, with the player key that classifies the same URLs in v4. */
const V3_PATTERNS: Record<string, [key: string, regex: RegExp]> = {
  HLS_EXTENSIONS: ['hls', /\.(m3u8)($|\?)/i],
  DASH_EXTENSIONS: ['dash', /\.(mpd)($|\?)/i],
  MATCH_URL_MUX: ['mux', /stream\.mux\.com\/(?!\w+\.m3u8)(\w+)/],
  MATCH_URL_YOUTUBE: [
    'youtube',
    /(?:youtu\.be\/|youtube(?:-nocookie|education)?\.com\/(?:embed\/|v\/|watch\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))((\w|-){11})|youtube\.com\/playlist\?list=|youtube\.com\/user\//,
  ],
  MATCH_URL_VIMEO: ['vimeo', /vimeo\.com\/(?!progressive_redirect).+/],
  MATCH_URL_WISTIA: ['wistia', /(?:wistia\.(?:com|net)|wi\.st)\/(?:medias|embed)\/(?:iframe\/)?([^?]+)/],
  MATCH_URL_SPOTIFY: ['spotify', /open\.spotify\.com\/(\w+)\/(\w+)/i],
  MATCH_URL_TWITCH: ['twitch', /(?:www\.|go\.)?twitch\.tv\/([a-zA-Z0-9_]+|(videos?\/|\?video=)\d+)($|\?)/],
  MATCH_URL_TIKTOK: ['tiktok', /tiktok\.com\/(?:player\/v1\/|share\/video\/|@[^/]+\/video\/)([0-9]+)/],
};

interface Context {
  j: JSCodeshift;
  root: Collection;
  report: (message: string) => void;
  changed: boolean;
  migrated: Set<AnyNode>;
}

export default function transform(file: FileInfo, api: API): string | undefined {
  const j = api.jscodeshift;
  const root = j(file.source);
  const ctx: Context = { j, root, report: api.report ?? (() => {}), changed: false, migrated: new Set() };

  const imports = root
    .find(j.ImportDeclaration)
    .filter((path) => moduleName(path.node.source.value)?.startsWith('react-player') ?? false);
  const players = findPlayerNames(ctx, imports);
  if (!imports.size() && !players.size) return undefined;

  // Read before migratePatterns() may remove imports.
  const configTypes = importedNames(imports, 'react-player/types', 'Config');
  const entryTypes = importedNames(imports, 'react-player/players', 'PlayerEntry');

  const refs: AnyNode[] = [];
  root
    .find(j.JSXOpeningElement)
    .filter((path) => path.node.name.type === 'JSXIdentifier' && players.has(path.node.name.name))
    .forEach((path) => migrateElement(ctx, path, refs));

  migrateRefUsage(ctx, refs);

  for (const name of configTypes) {
    for (const obj of objectsOfType(ctx, name)) migrateConfig(ctx, obj);
  }

  imports
    .filter((path) => moduleName(path.node.source.value) === 'react-player/patterns')
    .forEach((path) => migratePatterns(ctx, path));

  migrateCustomPlayers(ctx, players, entryTypes);

  if (!ctx.changed) return undefined;
  return root.toSource({
    quote: detectQuote(ctx),
    // Objects that lose a property are reprinted, so match the file's trailing commas.
    trailingComma: /,\s*\n\s*[}\]]/.test(file.source),
  });
}

// ---------------------------------------------------------------------------------------------------------------------
// <ReactPlayer>

/** Local names that refer to the ReactPlayer component, from static imports, `import()` and `require()`. */
function findPlayerNames({ j, root }: Context, imports: Collection<AnyNode>) {
  const names = new Set<string>();

  imports
    .filter((path) => moduleName(path.node.source.value) === 'react-player')
    .forEach((path) => {
      for (const spec of path.node.specifiers ?? []) {
        if (spec.type === 'ImportDefaultSpecifier') names.add(spec.local.name);
        if (spec.type === 'ImportSpecifier' && spec.imported.name === 'default') names.add(spec.local.name);
      }
    });

  // e.g. `const ReactPlayer = dynamic(() => import('react-player'), { ssr: false })` or `lazy(...)`
  root.find(j.VariableDeclarator, { id: { type: 'Identifier' } }).forEach((path) => {
    const init = path.get('init');
    if (!init.node) return;
    if (
      isModuleLoad(init.node) ||
      j(init)
        .find(j.Node)
        .filter((p) => isModuleLoad(p.node))
        .size()
    ) {
      names.add((path.node.id as AnyNode).name);
    }
  });

  return names;
}

function isModuleLoad(node: AnyNode) {
  if (node.type === 'ImportExpression') return stringValue(node.source) === 'react-player';
  if (node.type !== 'CallExpression') return false;
  const isLoader =
    node.callee.type === 'Import' || (node.callee.type === 'Identifier' && node.callee.name === 'require');
  return isLoader && stringValue(node.arguments[0]) === 'react-player';
}

function migrateElement(ctx: Context, path: ASTPath<AnyNode>, refs: AnyNode[]) {
  const { j } = ctx;
  const attributes: AnyNode[] = path.node.attributes ?? [];
  const attribute = (name: string) =>
    attributes.find(
      (attr) => attr.type === 'JSXAttribute' && attr.name.type === 'JSXIdentifier' && attr.name.name === name
    );

  // v3's `ref` was the media for every player. In v4 that is `mediaRef`, and `ref` is the rendered DOM element.
  const ref = attribute('ref');
  if (ref && !attribute('mediaRef')) {
    ref.name = j.jsxIdentifier('mediaRef');
    ctx.changed = true;
    if (ref.value?.type === 'JSXExpressionContainer') refs.push(ref.value.expression);
  }

  const config = attribute('config');
  const expression = config?.value?.type === 'JSXExpressionContainer' ? config.value.expression : undefined;
  if (!expression) return;

  const obj = resolveObject(ctx, expression);
  if (obj) {
    migrateConfig(ctx, obj);
  } else {
    // A comment between attributes only reads well when they are on their own lines.
    const multiline = path.node.loc && path.node.loc.start.line !== path.node.loc.end.line;
    addTodo(
      ctx,
      multiline ? config : path,
      'config keys are named after the Video.js v10 engines: hls => hlsJs, dash => dashJs, and html is removed. ' +
        'Check the config passed here, see MIGRATING.md.'
    );
  }
}

// ---------------------------------------------------------------------------------------------------------------------
// ref => mediaRef

/** Flags v3 `ref` usage that changed meaning now that the ref is `mediaRef`, and renames `.api` to `.engine`. */
function migrateRefUsage(ctx: Context, refs: AnyNode[]) {
  const { j, root } = ctx;
  const trackable = refs.filter((ref) => ref.type === 'Identifier' || isThisMember(ref));
  if (!trackable.length) return;

  const isCurrent = (node: AnyNode) =>
    isMember(node) &&
    !node.computed &&
    node.property.name === 'current' &&
    trackable.some((ref) => sameReference(ref, node.object));

  // e.g. `const player = playerRef.current`
  const aliases = new Set<string>();
  root.find(j.VariableDeclarator, { id: { type: 'Identifier' } }).forEach((path) => {
    if (path.node.init && isCurrent(unwrap(path.node.init))) aliases.add((path.node.id as AnyNode).name);
  });

  const isMedia = (node: AnyNode) => isCurrent(unwrap(node)) || (node.type === 'Identifier' && aliases.has(node.name));

  root
    .find(j.Node)
    .filter(({ node }: AnyNode) => isMember(node) && !node.computed && isMedia(node.object))
    .forEach((path: AnyNode) => {
      const name = path.node.property.name;
      if (name === 'api') {
        path.node.property = j.identifier('engine');
        addTodo(
          ctx,
          path,
          '`api` is now `engine` on the media, and can be null until the engine loads. For HLS, DASH and Mux sources ' +
            '`mediaRef` is the <video> element, which has no engine: read hls.js or dash.js from the Video.js ' +
            'player with useMedia() instead, see MIGRATING.md.'
        );
      } else if (DOM_ONLY_MEMBERS.has(name)) {
        addTodo(ctx, path, domRefMessage);
      }
    });

  // e.g. `screenfull.request(playerRef.current)`
  root
    .find(j.CallExpression)
    .filter(
      ({ node }: AnyNode) =>
        isMember(node.callee) &&
        node.callee.object.type === 'Identifier' &&
        node.callee.object.name === 'screenfull' &&
        node.arguments.some(isMedia)
    )
    .forEach((path) => addTodo(ctx, path, domRefMessage));
}

const domRefMessage =
  '`mediaRef` is the media, which is not a DOM element for embeds such as YouTube. ' +
  'Pass a separate `ref` to <ReactPlayer> for DOM access.';

// ---------------------------------------------------------------------------------------------------------------------
// config

function migrateConfig(ctx: Context, obj: AnyNode) {
  if (ctx.migrated.has(obj)) return;
  ctx.migrated.add(obj);

  const keys = new Set(obj.properties.filter(isProperty).map(propertyKey));

  obj.properties = obj.properties.filter((prop: AnyNode) => {
    if (!isProperty(prop)) return true;
    const key = propertyKey(prop);

    if (key === 'html') {
      ctx.changed = true;
      ctx.report(`${lineOf(prop)}Removed config.html, which v3 never applied.`);
      return false;
    }

    if (key && RENAMED_CONFIG_KEYS[key] && !keys.has(RENAMED_CONFIG_KEYS[key])) {
      renameKey(ctx, prop, RENAMED_CONFIG_KEYS[key]);
    } else if (key === 'spotify') {
      withObject(ctx, prop, 'spotify', migrateSpotify);
    } else if (key === 'tiktok') {
      withObject(ctx, prop, 'tiktok', migrateTikTok);
    } else if (key === 'twitch') {
      withObject(ctx, prop, 'twitch', migrateTwitch);
    } else if (key === 'mux') {
      const mux = resolveObject(ctx, prop.value);
      const isMuxSource = mux?.properties.every((p: AnyNode) => isProperty(p) && MUX_SOURCE_KEYS.has(propertyKey(p)!));
      if (!isMuxSource) {
        addTodo(
          ctx,
          prop,
          'config.mux now takes MuxSource options from @videojs/mux-video: playback, poster, storyboard and drm. ' +
            'Mux Player options such as metadata and envKey move to the MuxData extension, see MIGRATING.md.'
        );
      }
    }
    return true;
  });
}

function withObject(ctx: Context, prop: AnyNode, key: string, migrate: (ctx: Context, obj: AnyNode) => void) {
  const obj = resolveObject(ctx, prop.value);
  if (obj) {
    migrate(ctx, obj);
  } else {
    addTodo(ctx, prop, `Some config.${key} options changed shape in v4, see MIGRATING.md.`);
  }
}

function migrateSpotify(ctx: Context, obj: AnyNode) {
  obj.properties = obj.properties.filter((prop: AnyNode) => {
    if (!isProperty(prop)) return true;
    const key = propertyKey(prop);

    if (key === 'startAt') renameKey(ctx, prop, 't');

    if (key === 'theme') {
      const theme = stringValue(prop.value);
      if (theme === 'dark') {
        prop.value = ctx.j.numericLiteral(0);
        prop.shorthand = false;
        ctx.changed = true;
      } else if (theme === 'light') {
        ctx.changed = true;
        return false;
      } else if (numberValue(prop.value) !== 0) {
        addTodo(ctx, prop, 'config.spotify.theme is `0` for the dark theme. Leave it out for the light theme.');
      }
    }
    return true;
  });
}

function migrateTikTok(ctx: Context, obj: AnyNode) {
  const { j } = ctx;
  for (const prop of obj.properties) {
    if (!isProperty(prop) || !TIKTOK_FLAGS.has(propertyKey(prop)!)) continue;

    const value = unwrap(prop.value);
    const flag = booleanValue(value);
    if (flag !== undefined) {
      prop.value = j.numericLiteral(flag ? 1 : 0);
    } else if (numberValue(value) !== undefined || isNumericConditional(value)) {
      continue;
    } else {
      // `progress_bar: show` => `progress_bar: show ? 1 : 0`
      const test = prop.shorthand ? j.identifier(prop.value.name) : prop.value;
      prop.value = j.conditionalExpression(test, j.numericLiteral(1), j.numericLiteral(0));
    }
    prop.shorthand = false;
    ctx.changed = true;
  }
}

function migrateTwitch(ctx: Context, obj: AnyNode) {
  for (const prop of obj.properties) {
    if (!isProperty(prop) || propertyKey(prop) !== 'time') continue;

    const seconds = numberValue(unwrap(prop.value));
    if (seconds !== undefined) {
      prop.value = ctx.j.stringLiteral(toTwitchTime(seconds));
      prop.shorthand = false;
      ctx.changed = true;
    } else if (stringValue(prop.value) === undefined) {
      addTodo(ctx, prop, "config.twitch.time is a Twitch timestamp string such as '1h30m10s' instead of seconds.");
    }
  }
}

/** Seconds as a Twitch timestamp, e.g. `5410` => `'1h30m10s'`. */
export function toTwitchTime(value: number) {
  const total = Math.max(0, Math.floor(value));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return `${hours ? `${hours}h` : ''}${hours || minutes ? `${minutes}m` : ''}${seconds}s`;
}

// ---------------------------------------------------------------------------------------------------------------------
// react-player/patterns

function migratePatterns(ctx: Context, path: ASTPath<AnyNode>) {
  const { j, root } = ctx;
  const specifiers: AnyNode[] = path.node.specifiers ?? [];

  if (specifiers.some((spec) => spec.type === 'ImportNamespaceSpecifier')) {
    addTodo(
      ctx,
      path,
      "react-player/patterns no longer exports the URL regexes, and canPlay.youtube(url) is now canPlay('youtube')(url)."
    );
    return;
  }

  let canPlay: string | undefined = specifiers.find((spec) => importedName(spec) === 'canPlay')?.local.name;

  // `canPlay.youtube` => `canPlay('youtube')`, `canPlay[key]` => `canPlay(key)`
  if (canPlay) {
    root
      .find(j.MemberExpression, { object: { type: 'Identifier', name: canPlay } })
      .replaceWith(({ node }: AnyNode) => {
        ctx.changed = true;
        const key = node.computed ? node.property : j.stringLiteral(node.property.name);
        return j.callExpression(j.identifier(canPlay!), [key]);
      });
  }

  const useCanPlay = () => {
    if (canPlay) return canPlay;
    const taken = root.find(j.Identifier, { name: 'canPlay' }).size() > 0;
    canPlay = taken ? 'canPlayPlayer' : 'canPlay';
    specifiers.push(j.importSpecifier(j.identifier('canPlay'), taken ? j.identifier(canPlay) : null));
    return canPlay;
  };

  const copies: AnyNode[] = [];

  for (const spec of [...specifiers]) {
    const pattern = V3_PATTERNS[importedName(spec)!];
    if (!pattern) continue;
    const [key, regex] = pattern;
    const local: string = spec.local.name;

    // `MATCH_URL_YOUTUBE.test(url)` => `canPlay('youtube')(url)`
    root
      .find(j.CallExpression, {
        callee: { object: { type: 'Identifier', name: local }, property: { name: 'test' } },
      })
      .filter((call) => isMember(call.node.callee) && call.node.arguments.length === 1)
      .replaceWith(({ node }) =>
        j.callExpression(j.callExpression(j.identifier(useCanPlay()), [j.stringLiteral(key)]), node.arguments)
      );

    // Anything else, e.g. `url.match(MATCH_URL_YOUTUBE)`, gets a copy of the v3 regex.
    const references = root.find(j.Identifier, { name: local }).filter((id) => isReference(id));
    if (references.size()) {
      const declaration = j.variableDeclaration('const', [j.variableDeclarator(j.identifier(local), j.literal(regex))]);
      addTodo(
        ctx,
        declaration,
        `react-player/patterns no longer exports ${local}, so this is a copy of the v3 regex. ` +
          `To check a URL the way ReactPlayer does, use canPlay('${key}')(url).`
      );
      copies.push(declaration);
    }

    specifiers.splice(specifiers.indexOf(spec), 1);
    ctx.changed = true;
  }

  const body: AnyNode[] = root.find(j.Program).get().node.body;
  const lastImport = body.findLastIndex((node) => node.type === 'ImportDeclaration');
  body.splice(lastImport + 1, 0, ...copies);

  if (!specifiers.length) removeStatement(ctx, path);
}

// ---------------------------------------------------------------------------------------------------------------------
// Custom players

function migrateCustomPlayers(ctx: Context, players: Set<string>, entryTypes: string[]) {
  const { j, root } = ctx;
  const removeName = (obj: AnyNode) => {
    const before = obj.properties.length;
    obj.properties = obj.properties.filter((prop: AnyNode) => !(isProperty(prop) && propertyKey(prop) === 'name'));
    if (obj.properties.length !== before) ctx.changed = true;
  };

  root
    .find(j.CallExpression)
    .filter(
      ({ node }: AnyNode) =>
        isMember(node.callee) &&
        node.callee.object.type === 'Identifier' &&
        players.has(node.callee.object.name) &&
        node.callee.property.name === 'addCustomPlayer'
    )
    .forEach((path) => {
      const entry = resolveObject(ctx, path.node.arguments[0]);
      if (entry) removeName(entry);
      addTodo(
        ctx,
        path,
        'Custom players follow the Video.js v10 media contract: forward `ref` to the element you render, hand the ' +
          'media to the `mediaRef` prop, and read options from the whole `config` object. See MIGRATING.md.'
      );
    });

  for (const name of entryTypes) {
    for (const obj of objectsOfType(ctx, name)) removeName(obj);
  }
}

// ---------------------------------------------------------------------------------------------------------------------
// Helpers

function addTodo(ctx: Context, target: ASTPath<AnyNode> | AnyNode, message: string) {
  const { j } = ctx;
  let node: AnyNode = target;

  // Paths are flagged at the closest statement, class member or JSX attribute. Nodes are flagged in place.
  if (isPath(target)) {
    let path: ASTPath<AnyNode> = target;
    while (path.parent && !j.Statement.check(path.node) && !COMMENTABLE.test(path.node.type)) {
      path = path.parent;
    }
    while (path.parent && /^Export(Named|Default)Declaration$/.test(path.parent.node.type)) path = path.parent;
    node = path.node;
  }
  const block = node.type === 'JSXAttribute';

  const text = `${TODO} ${message}`;
  node.comments ??= [];
  if (node.comments.some((comment: AnyNode) => comment.value.includes(text))) return;
  node.comments.push(block ? j.commentBlock(` ${text} `, true, false) : j.commentLine(` ${text}`, true, false));
  ctx.changed = true;
  ctx.report(`${lineOf(isPath(target) ? target.node : target)}${message}`);
}

const COMMENTABLE = /^(ClassProperty|ClassMethod|PropertyDefinition|MethodDefinition)$/;

const isPath = (value: AnyNode): value is ASTPath<AnyNode> => typeof value?.get === 'function' && 'node' in value;

const lineOf = (node: AnyNode) => (node?.loc ? `line ${node.loc.start.line}: ` : '');

/** The object literal an expression evaluates to, following `const` bindings and `useMemo(() => ({ ... }))`. */
function resolveObject(ctx: Context, expression: AnyNode, depth = 0): AnyNode | undefined {
  const { j, root } = ctx;
  const node = unwrap(expression);
  if (!node || depth > 3) return undefined;
  if (node.type === 'ObjectExpression') return node;

  if (node.type === 'Identifier') {
    const declarators = root.find(j.VariableDeclarator, { id: { type: 'Identifier', name: node.name } });
    return declarators.size() === 1 ? resolveObject(ctx, declarators.get().node.init, depth + 1) : undefined;
  }

  if (node.type === 'CallExpression' && isUseMemo(node.callee)) {
    const fn = node.arguments[0];
    if (fn?.type !== 'ArrowFunctionExpression') return undefined;
    if (fn.body.type !== 'BlockStatement') return resolveObject(ctx, fn.body, depth + 1);
    const ret = fn.body.body.find((statement: AnyNode) => statement.type === 'ReturnStatement');
    return ret ? resolveObject(ctx, ret.argument, depth + 1) : undefined;
  }

  return undefined;
}

const isUseMemo = (callee: AnyNode) =>
  (callee.type === 'Identifier' && callee.name === 'useMemo') ||
  (isMember(callee) && !callee.computed && callee.property.name === 'useMemo');

/** Object literals declared or asserted as type `name`, or an array of it. */
function objectsOfType({ j, root }: Context, name: string): AnyNode[] {
  const objects: AnyNode[] = [];
  const collect = (node: AnyNode, type: AnyNode) => {
    const value = unwrap(node);
    if (!value || !type) return;
    if (isTypeReference(type, name) && value.type === 'ObjectExpression') objects.push(value);
    if (type.type === 'TSArrayType' && isTypeReference(type.elementType, name) && value.type === 'ArrayExpression') {
      objects.push(...value.elements.map(unwrap).filter((el: AnyNode) => el?.type === 'ObjectExpression'));
    }
  };

  root.find(j.VariableDeclarator).forEach(({ node }: AnyNode) => {
    collect(node.init, node.id.typeAnnotation?.typeAnnotation);
  });
  root
    .find(j.Node)
    .filter(({ node }: AnyNode) => node.type === 'TSAsExpression' || node.type === 'TSSatisfiesExpression')
    .forEach(({ node }: AnyNode) => collect(node.expression, node.typeAnnotation));

  return objects;
}

const isTypeReference = (type: AnyNode, name: string) =>
  type?.type === 'TSTypeReference' && type.typeName.type === 'Identifier' && type.typeName.name === name;

/** Local names of the named import `name` from `source`. */
function importedNames(imports: Collection<AnyNode>, source: string, name: string) {
  const names: string[] = [];
  imports
    .filter((path) => moduleName(path.node.source.value) === source)
    .forEach((path) => {
      for (const spec of path.node.specifiers ?? []) {
        if (importedName(spec) === name) names.push(spec.local.name);
      }
    });
  return names;
}

const importedName = (spec: AnyNode): string | undefined =>
  spec.type === 'ImportSpecifier' ? (spec.imported.name ?? spec.imported.value) : undefined;

/** `react-player/dist/patterns.js` => `react-player/patterns` */
const moduleName = (source: unknown) =>
  typeof source === 'string'
    ? source.replace(/^react-player\/dist\//, 'react-player/').replace(/\.js$/, '')
    : undefined;

function renameKey(ctx: Context, prop: AnyNode, name: string) {
  if (prop.shorthand) prop.value = ctx.j.identifier(prop.key.name);
  prop.key = ctx.j.identifier(name);
  prop.computed = false;
  prop.shorthand = false;
  ctx.changed = true;
}

/** Removes a statement, keeping comments such as a license header that are attached to it. */
function removeStatement(ctx: Context, path: ASTPath<AnyNode>) {
  const body: AnyNode[] = path.parent.node.body;
  const comments = path.node.comments?.filter((comment: AnyNode) => comment.leading);
  const next = body[body.indexOf(path.node) + 1];
  if (comments?.length && next) next.comments = [...comments, ...(next.comments ?? [])];
  ctx.j(path).remove();
}

/** Whether an identifier is a reference to a binding, rather than a property name or an import. */
function isReference(path: ASTPath<AnyNode>) {
  const parent = path.parent.node;
  if (/^Import/.test(parent.type)) return false;
  if (isMember(parent) && parent.property === path.node && !parent.computed) return false;
  if (isProperty(parent) && parent.key === path.node && !parent.computed && !parent.shorthand) return false;
  return true;
}

const isMember = (node: AnyNode) => node?.type === 'MemberExpression' || node?.type === 'OptionalMemberExpression';

const isThisMember = (node: AnyNode) => isMember(node) && node.object.type === 'ThisExpression' && !node.computed;

/** `playerRef` and `playerRef`, or `this.player` and `this.player`. */
const sameReference = (a: AnyNode, b: AnyNode) =>
  (a.type === 'Identifier' && b.type === 'Identifier' && a.name === b.name) ||
  (isThisMember(a) && isThisMember(b) && a.property.name === b.property.name);

const isProperty = (node: AnyNode) => node?.type === 'ObjectProperty' || node?.type === 'Property';

function propertyKey(prop: AnyNode): string | undefined {
  if (!prop.computed && prop.key.type === 'Identifier') return prop.key.name;
  return stringValue(prop.key);
}

function unwrap(node: AnyNode): AnyNode {
  while (
    node &&
    /^(TSAsExpression|TSSatisfiesExpression|TSNonNullExpression|ParenthesizedExpression|TypeCastExpression)$/.test(
      node.type
    )
  ) {
    node = node.expression;
  }
  return node;
}

const literalValue = (node: AnyNode, babelType: string, type: string) => {
  if (node?.type === babelType) return node.value;
  if (node?.type === 'Literal' && typeof node.value === type) return node.value;
  return undefined;
};

const stringValue = (node: AnyNode): string | undefined => literalValue(node, 'StringLiteral', 'string');
const numberValue = (node: AnyNode): number | undefined => literalValue(node, 'NumericLiteral', 'number');
const booleanValue = (node: AnyNode): boolean | undefined => literalValue(node, 'BooleanLiteral', 'boolean');

const isNumericConditional = (node: AnyNode) =>
  node?.type === 'ConditionalExpression' &&
  numberValue(node.consequent) !== undefined &&
  numberValue(node.alternate) !== undefined;

/** Prints new strings with the quotes the file already uses. */
function detectQuote({ j, root }: Context): 'single' | 'double' {
  const literal = root.find(j.ImportDeclaration).nodes()[0]?.source as AnyNode;
  return literal?.extra?.raw?.startsWith('"') ? 'double' : 'single';
}
