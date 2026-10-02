import { resolveAdapterType, resolveMimeType, type AdapterType } from '@videojs/react';

export const AUDIO_EXTENSIONS =
  /\.(m4a|m4b|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i;
export const VIDEO_EXTENSIONS = /\.(mp4|og[gv]|webm|mov|m4v)(#t=[,\d+]+)?($|\?)/i;


const canPlayFile = (url: string, test: (u: string) => boolean) => {
  if (Array.isArray(url)) {
    for (const item of url) {
      if (typeof item === 'string' && canPlayFile(item, test)) {
        return true;
      }
      if (canPlayFile(item.src, test)) {
        return true;
      }
    }
    return false;
  }
  return test(url);
};

const adapterType = (url: string) => (typeof url === 'string' ? resolveAdapterType(url) : null);

const isAdapter = (type: AdapterType) => (url: string) => adapterType(url) === type;

// Mux stream URLs with the `.m3u8` extension resolve to `mux`, but are played with hls.js so
// users can opt into it by adding the extension.
const isMuxHls = (url: string) =>
  adapterType(url) === 'mux' && resolveMimeType(url) === 'application/x-mpegurl';

export const canPlay = {
  html: (url: string) =>
    canPlayFile(url, (u: string) => {
      const type = adapterType(u);
      // Fall back to the extension patterns for formats Video.js doesn't recognize (e.g. m4v, weba, oga).
      return (
        type === 'video' || type === 'audio' || AUDIO_EXTENSIONS.test(u) || VIDEO_EXTENSIONS.test(u)
      );
    }),
  hls: (url: string) => canPlayFile(url, (u: string) => isAdapter('hls')(u) || isMuxHls(u)),
  dash: (url: string) => canPlayFile(url, isAdapter('dash')),
  mux: (url: string) => isAdapter('mux')(url) && !isMuxHls(url),
  youtube: isAdapter('youtube'),
  vimeo: isAdapter('vimeo'),
  wistia: isAdapter('wistia'),
  spotify: isAdapter('spotify'),
  twitch: isAdapter('twitch'),
  tiktok: isAdapter('tiktok'),
};
