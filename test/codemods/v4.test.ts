import jscodeshift from 'jscodeshift';
import { describe, expect, test } from 'vite-plus/test';

import transform, { parser, toTwitchTime } from '../../codemods/v4';

/** Strips the indentation of a template literal, so sources and expected outputs can be indented with the tests. */
const dedent = (code: string) => {
  const lines = code
    .replace(/^\n/, '')
    .replace(/\n\s*$/, '')
    .split('\n');
  const indent = Math.min(...lines.filter((line) => line.trim()).map((line) => line.match(/^ */)![0].length));
  return lines.map((line) => line.slice(indent)).join('\n');
};

const run = (source: string) => {
  const reports: string[] = [];
  const j = jscodeshift.withParser(parser);
  const output = transform(
    { path: 'App.tsx', source: dedent(source) },
    { j, jscodeshift: j, stats: () => {}, report: (message: string) => reports.push(message) }
  );
  return { output, reports };
};

const migrate = (source: string) => run(source).output;

describe('ref', () => {
  test('ref => mediaRef', () => {
    expect(
      migrate(`
        import ReactPlayer from 'react-player';

        const Player = ({ src }) => {
          const playerRef = useRef(null);
          const seek = () => {
            playerRef.current.currentTime = 30;
          };
          return <ReactPlayer ref={playerRef} src={src} />;
        };
      `)
    ).toBe(
      dedent(`
        import ReactPlayer from 'react-player';

        const Player = ({ src }) => {
          const playerRef = useRef(null);
          const seek = () => {
            playerRef.current.currentTime = 30;
          };
          return <ReactPlayer mediaRef={playerRef} src={src} />;
        };
      `)
    );
  });

  test('callback refs and forwarded refs', () => {
    expect(
      migrate(`
        import ReactPlayer from 'react-player';

        const A = () => <ReactPlayer ref={(player) => console.log(player)} />;
        const B = forwardRef((props, ref) => <ReactPlayer {...props} ref={ref} />);
      `)
    ).toBe(
      dedent(`
        import ReactPlayer from 'react-player';

        const A = () => <ReactPlayer mediaRef={(player) => console.log(player)} />;
        const B = forwardRef((props, ref) => <ReactPlayer {...props} mediaRef={ref} />);
      `)
    );
  });

  test('keeps ref when mediaRef is already set', () => {
    expect(
      migrate(`
        import ReactPlayer from 'react-player';

        <ReactPlayer ref={elementRef} mediaRef={mediaRef} />;
      `)
    ).toBeUndefined();
  });

  test('api => engine', () => {
    const { output, reports } = run(`
      import ReactPlayer from 'react-player';

      function Player() {
        const playerRef = useRef(null);
        const onReady = () => {
          playerRef.current?.api.setQuality('hd');
          const player = playerRef.current;
          console.log(player.api);
        };
        return <ReactPlayer ref={playerRef} onReady={onReady} />;
      }
    `);
    expect(output).toContain('playerRef.current?.engine.setQuality');
    expect(output).toContain('console.log(player.engine)');
    expect(output).not.toContain('TODO');
    expect(reports).toHaveLength(0);
  });

  test('flags DOM access through the ref', () => {
    const { output } = run(`
      import ReactPlayer from 'react-player';
      import screenfull from 'screenfull';

      class Player extends React.Component {
        player = React.createRef();
        fullscreen = () => screenfull.request(this.player.current);
        box = () => this.player.current.getBoundingClientRect();
        render() {
          return <ReactPlayer ref={this.player} />;
        }
      }
    `);
    expect(output).toMatch(/\/\/ TODO\(react-player v4\): `mediaRef` is the media.*\n\s+fullscreen =/);
    expect(output).toMatch(/\/\/ TODO\(react-player v4\): `mediaRef` is the media.*\n\s+box =/);
    expect(output).toContain('<ReactPlayer mediaRef={this.player} />');
  });
});

describe('config', () => {
  test('renames hls and dash, and removes html', () => {
    expect(
      migrate(`
        import ReactPlayer from 'react-player';

        <ReactPlayer
          src={src}
          config={{
            hls: { maxBufferLength: 60 },
            dash: { streaming: { abr: { autoSwitchBitrate: { video: false } } } },
            html: { foo: 'bar' },
            youtube: { color: 'white' },
          }}
        />;
      `)
    ).toBe(
      dedent(`
        import ReactPlayer from 'react-player';

        <ReactPlayer
          src={src}
          config={{
            hlsJs: { maxBufferLength: 60 },
            dashJs: { streaming: { abr: { autoSwitchBitrate: { video: false } } } },
            youtube: { color: 'white' },
          }}
        />;
      `)
    );
  });

  test('shorthand and string keys', () => {
    expect(
      migrate(`
        import ReactPlayer from 'react-player';

        <ReactPlayer config={{ hls, 'dash': dashConfig }} />;
      `)
    ).toBe(
      dedent(`
        import ReactPlayer from 'react-player';

        <ReactPlayer config={{ hlsJs: hls, dashJs: dashConfig }} />;
      `)
    );
  });

  test('follows a const, useMemo and the Config type', () => {
    const output = migrate(`
      import ReactPlayer from 'react-player';
      import type { Config } from 'react-player/types';

      const config = { hls: { debug: true } };
      const shared: Config = { dash: {} };
      const other = { hls: {} } satisfies Config;

      function Player() {
        const memoized = useMemo(() => ({ hls: { debug } }), [debug]);
        return (
          <>
            <ReactPlayer config={config} />
            <ReactPlayer config={memoized} />
          </>
        );
      }
    `);
    expect(output).toContain('const config = { hlsJs: { debug: true } };');
    expect(output).toContain('const shared: Config = { dashJs: {} };');
    expect(output).toContain('const other = { hlsJs: {} } satisfies Config;');
    expect(output).toContain('useMemo(() => ({ hlsJs: { debug } }), [debug])');
  });

  test('flags a config it cannot follow', () => {
    const { output, reports } = run(`
      import ReactPlayer from 'react-player';

      const Player = (props) => <ReactPlayer src={props.src} config={props.config} />;
    `);
    expect(output).toMatch(/\/\/ TODO\(react-player v4\): config keys are named.*\nconst Player =/);
    expect(reports).toHaveLength(1);

    expect(
      migrate(`
        import ReactPlayer from 'react-player';

        const Player = ({ src, config }) => (
          <ReactPlayer
            src={src}
            config={config}
          />
        );
      `)
    ).toMatch(/\/\* TODO\(react-player v4\): config keys are named.* \*\/\n\s+config=\{config\}/);
  });

  test('spotify, tiktok and twitch options', () => {
    expect(
      migrate(`
        import ReactPlayer from 'react-player';

        <ReactPlayer
          config={{
            spotify: { startAt: 30, theme: 'dark', preferVideo: true },
            tiktok: { progress_bar: true, description: false, rel: 1, music_info: showMusic, referrerPolicy: 'origin' },
            twitch: { time: 5410, parent: ['example.com'] },
          }}
        />;
      `)
    ).toBe(
      dedent(`
        import ReactPlayer from 'react-player';

        <ReactPlayer
          config={{
            spotify: { t: 30, theme: 0, preferVideo: true },
            tiktok: { progress_bar: 1, description: 0, rel: 1, music_info: showMusic ? 1 : 0, referrerPolicy: 'origin' },
            twitch: { time: '1h30m10s', parent: ['example.com'] },
          }}
        />;
      `)
    );
  });

  test('spotify light theme is removed', () => {
    expect(
      migrate(`
        import ReactPlayer from 'react-player';

        <ReactPlayer config={{ spotify: { theme: 'light' } }} />;
      `)
    ).toBe(
      dedent(`
        import ReactPlayer from 'react-player';

        <ReactPlayer config={{ spotify: {} }} />;
      `)
    );
  });

  test('flags twitch time it cannot convert', () => {
    expect(
      migrate(`
        import ReactPlayer from 'react-player';

        <ReactPlayer config={{ twitch: { time: startTime } }} />;
      `)
    ).toContain("// TODO(react-player v4): config.twitch.time is a Twitch timestamp string such as '1h30m10s'");
  });

  test('flags Mux Player options in config.mux', () => {
    const flagged = migrate(`
      import ReactPlayer from 'react-player';

      <ReactPlayer config={{ mux: { metadata: { video_title: 'My video' } } }} />;
    `);
    expect(flagged).toContain('// TODO(react-player v4): config.mux now takes MuxSource options');

    expect(
      migrate(`
        import ReactPlayer from 'react-player';

        <ReactPlayer config={{ mux: { playback: { maxResolution: '1080p' } } }} />;
      `)
    ).toBeUndefined();
  });
});

describe('react-player/patterns', () => {
  test('canPlay.key => canPlay(key)', () => {
    expect(
      migrate(`
        import { canPlay } from 'react-player/patterns';

        const isYouTube = canPlay.youtube(url);
        const isVimeo = canPlay['vimeo'](url);
        const check = canPlay[key];
        const players = [{ key: 'hls', canPlay: canPlay.hls }];
      `)
    ).toBe(
      dedent(`
        import { canPlay } from 'react-player/patterns';

        const isYouTube = canPlay('youtube')(url);
        const isVimeo = canPlay('vimeo')(url);
        const check = canPlay(key);
        const players = [{ key: 'hls', canPlay: canPlay('hls') }];
      `)
    );
  });

  test('MATCH_URL_*.test(url) => canPlay(key)(url)', () => {
    expect(
      migrate(`
        import { MATCH_URL_YOUTUBE, HLS_EXTENSIONS, VIDEO_EXTENSIONS } from 'react-player/patterns';

        const isYouTube = MATCH_URL_YOUTUBE.test(url);
        const isHls = HLS_EXTENSIONS.test(url);
        const isVideo = VIDEO_EXTENSIONS.test(url);
      `)
    ).toBe(
      dedent(`
        import { VIDEO_EXTENSIONS, canPlay } from 'react-player/patterns';

        const isYouTube = canPlay('youtube')(url);
        const isHls = canPlay('hls')(url);
        const isVideo = VIDEO_EXTENSIONS.test(url);
      `)
    );
  });

  test('copies a removed regex that is used some other way', () => {
    const { output, reports } = run(`
      // Header comment
      import { MATCH_URL_YOUTUBE } from 'react-player/patterns';
      import other from 'other';

      const id = url.match(MATCH_URL_YOUTUBE)?.[1];
    `);
    expect(output).toBe(
      dedent(`
        // Header comment
        import other from 'other';

        // TODO(react-player v4): react-player/patterns no longer exports MATCH_URL_YOUTUBE, so this is a copy of the v3 regex. To check a URL the way ReactPlayer does, use canPlay('youtube')(url).
        const MATCH_URL_YOUTUBE = /(?:youtu\\.be\\/|youtube(?:-nocookie|education)?\\.com\\/(?:embed\\/|v\\/|watch\\/|watch\\?v=|watch\\?.+&v=|shorts\\/|live\\/))((\\w|-){11})|youtube\\.com\\/playlist\\?list=|youtube\\.com\\/user\\//;

        const id = url.match(MATCH_URL_YOUTUBE)?.[1];
      `)
    );
    expect(reports).toHaveLength(1);
  });

  test('aliases canPlay when the name is taken', () => {
    expect(
      migrate(`
        import { MATCH_URL_VIMEO } from 'react-player/patterns';

        const canPlay = (url) => MATCH_URL_VIMEO.test(url);
      `)
    ).toBe(
      dedent(`
        import { canPlay as canPlayPlayer } from 'react-player/patterns';

        const canPlay = (url) => canPlayPlayer('vimeo')(url);
      `)
    );
  });
});

describe('custom players', () => {
  test('removes name and flags the new contract', () => {
    const output = migrate(`
      import ReactPlayer from 'react-player';

      ReactPlayer.addCustomPlayer({
        key: 'custom',
        name: 'Custom',
        canPlay: (src) => src.startsWith('custom:'),
        player: CustomPlayer,
      });
    `);
    expect(output).toBe(
      dedent(`
        import ReactPlayer from 'react-player';

        // TODO(react-player v4): Custom players follow the Video.js v10 media contract: forward \`ref\` to the element you render, hand the media to the \`mediaRef\` prop, and read options from the whole \`config\` object. See MIGRATING.md.
        ReactPlayer.addCustomPlayer({
          key: 'custom',
          canPlay: (src) => src.startsWith('custom:'),
          player: CustomPlayer,
        });
      `)
    );
  });

  test('removes name from PlayerEntry objects', () => {
    expect(
      migrate(`
        import type { PlayerEntry } from 'react-player/players';

        const entries: PlayerEntry[] = [{ key: 'a', name: 'A', canPlay }];
      `)
    ).toBe(
      dedent(`
        import type { PlayerEntry } from 'react-player/players';

        const entries: PlayerEntry[] = [{
          key: 'a',
          canPlay
        }];
      `)
    );
  });
});

describe('files', () => {
  test('next/dynamic and lazy imports', () => {
    expect(
      migrate(`
        const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

        <ReactPlayer ref={ref} config={{ hls: {} }} />;
      `)
    ).toBe(
      dedent(`
        const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

        <ReactPlayer mediaRef={ref} config={{ hlsJs: {} }} />;
      `)
    );
  });

  test('aliased default import', () => {
    expect(
      migrate(`
        import Video from 'react-player';

        <Video ref={ref} />;
      `)
    ).toContain('<Video mediaRef={ref} />');
  });

  test('keeps double quotes', () => {
    expect(
      migrate(`
        import ReactPlayer from "react-player";

        <ReactPlayer config={{ twitch: { time: 90 } }} />;
      `)
    ).toContain(`time: "1m30s"`);
  });

  test('leaves other files and other elements alone', () => {
    expect(migrate(`import Other from 'other';\n\n<Other ref={ref} config={{ hls: {} }} />;`)).toBeUndefined();
    expect(
      migrate(`
        import ReactPlayer from 'react-player';

        <video ref={ref} />;
      `)
    ).toBeUndefined();
  });
});

test('toTwitchTime()', () => {
  expect(toTwitchTime(0)).toBe('0s');
  expect(toTwitchTime(45)).toBe('45s');
  expect(toTwitchTime(90)).toBe('1m30s');
  expect(toTwitchTime(3600)).toBe('1h0m0s');
  expect(toTwitchTime(5410.7)).toBe('1h30m10s');
});
