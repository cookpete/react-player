import type { Config } from './types.js';

/**
 * Helpers that translate ReactPlayer's `src` + `config` into the props of a `@videojs/react` media
 * component. Video.js v10 media take a structured `source` whose `engine` key carries engine
 * options namespaced by engine, so every player can take the same `config` and read its own key.
 */
export type ToMediaProps = (src: string | undefined, config: Config | undefined) => Record<string, unknown>;

const splitConfig = ({ mux, wistia, ...engine }: Config = {}) => ({ mux, wistia, engine });

export const engineSource: ToMediaProps = (src, config) => ({
  source: { src, engine: splitConfig(config).engine },
});

const MUX_BARE_URL = /^https?:\/\/stream\.mux\.com\/(\w+)\/?(?:\?([^#]*))?(?:#.*)?$/;

const camelCase = (key: string) => key.replace(/_(\w)/g, (_, char: string) => char.toUpperCase());

/**
 * ReactPlayer matches Mux URLs without the `.m3u8` extension (`https://stream.mux.com/<id>?...`).
 * Turn those into a structured Mux source so the adapter derives the stream URL, poster and
 * storyboard itself, and layer `config.mux` on top. Mux plays through hls.js, so it also reads
 * `config.hlsJs` and `config.nativeHls`.
 */
export const muxSource: ToMediaProps = (src, config) => {
  const { mux, engine } = splitConfig(config);
  const options = { engine, ...mux };
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
export const wistiaSource: ToMediaProps = (src, config) => ({ src, source: config?.wistia });
