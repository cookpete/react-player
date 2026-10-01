/**
 * Helpers that translate ReactPlayer's `src` + player-specific `config` into the props of a
 * `@videojs/react` media component. Video.js v10 media take a structured `source` whose
 * `engine` key carries the options of the engine that plays it.
 */
export type ToMediaProps = (src: string | undefined, config: unknown) => Record<string, unknown>;

/** `config` becomes `source.engine[engine]`, alongside `src`. */
export const engineSource =
  (engine: string): ToMediaProps =>
  (src, config) => ({
    source: {
      src,
      ...(config ? { engine: { [engine]: config } } : {}),
    },
  });

const MUX_BARE_URL = /^https?:\/\/stream\.mux\.com\/(\w+)\/?(?:\?([^#]*))?(?:#.*)?$/;

const camelCase = (key: string) => key.replace(/_(\w)/g, (_, char: string) => char.toUpperCase());

/**
 * ReactPlayer matches Mux URLs without the `.m3u8` extension (`https://stream.mux.com/<id>?...`).
 * Turn those into a structured Mux source so the adapter derives the stream URL, poster and
 * storyboard itself, and let `config.mux` layer any other `MuxSource` options on top.
 */
export const muxSource: ToMediaProps = (src, config) => {
  const options = (config ?? {}) as Record<string, unknown> & { playback?: Record<string, unknown> };
  const match = src?.match(MUX_BARE_URL);
  if (!match) return { source: { src, ...options } };

  const [, playbackId, query] = match;
  const playback: Record<string, unknown> = { ...options.playback };
  for (const [key, value] of new URLSearchParams(query)) {
    playback[camelCase(key)] ??= value;
  }

  return {
    source: {
      playbackId,
      ...options,
      ...(Object.keys(playback).length ? { playback } : {}),
    },
  };
};

/** Wistia reads the media id from `src` and takes its own player options as `source`. */
export const wistiaSource: ToMediaProps = (src, config) => ({ src, source: config });
