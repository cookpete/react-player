import { resolveAdapterType, resolveMimeType, type AdapterType } from '@videojs/react';

export const AUDIO_EXTENSIONS =
  /\.(m4a|m4b|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i;
export const VIDEO_EXTENSIONS = /\.(mp4|og[gv]|webm|mov|m4v)(#t=[,\d+]+)?($|\?)/i;

export type PlayerKey = Exclude<AdapterType, 'video' | 'audio'> | 'html';

/** The key of the built-in player that plays `url`, from its Video.js adapter type. */
const resolvePlayerKey = (url: string): PlayerKey | null => {
  const type = resolveAdapterType(url);
  // Mux stream URLs with the `.m3u8` extension resolve to `mux`, but are played with hls.js so
  // users can opt into it by adding the extension.
  if (type === 'mux' && resolveMimeType(url) === 'application/x-mpegurl') return 'hls';
  if (type === 'video' || type === 'audio') return 'html';
  // The extension patterns cover formats Video.js doesn't recognize (e.g. m4v, weba, oga).
  if (!type && (AUDIO_EXTENSIONS.test(url) || VIDEO_EXTENSIONS.test(url))) return 'html';
  return type;
};

export const canPlay = (key: PlayerKey) => (url: string) => resolvePlayerKey(url) === key;
