export const AUDIO_EXTENSIONS =
  /\.(m4a|m4b|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i;
export const VIDEO_EXTENSIONS = /\.(mp4|og[gv]|webm|mov|m4v)(#t=[,\d+]+)?($|\?)/i;
export const HLS_EXTENSIONS = /\.(m3u8)($|\?)/i;
export const DASH_EXTENSIONS = /\.(mpd)($|\?)/i;
// Match Mux m3u8 URLs without the extension so users can use hls.js with Mux by adding the `.m3u8` extension. https://regexr.com/7um5f
export const MATCH_URL_MUX = /stream\.mux\.com\/(?!\w+\.m3u8)(\w+)/;
export const MATCH_URL_YOUTUBE =
  /(?:youtu\.be\/|youtube(?:-nocookie|education)?\.com\/(?:embed\/|v\/|watch\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))((\w|-){11})/;
export const MATCH_URL_VIMEO = /vimeo\.com\/(?!progressive_redirect).+/;
export const MATCH_URL_WISTIA =
  /(?:wistia\.(?:com|net)|wi\.st)\/(?:medias|embed)\/(?:iframe\/)?([^?]+)/;

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

export const canPlay = {
  html: (url: string) =>
    canPlayFile(url, (u: string) => AUDIO_EXTENSIONS.test(u) || VIDEO_EXTENSIONS.test(u)),
  hls: (url: string) => canPlayFile(url, (u: string) => HLS_EXTENSIONS.test(u)),
  dash: (url: string) => canPlayFile(url, (u: string) => DASH_EXTENSIONS.test(u)),
  mux: (url: string) => MATCH_URL_MUX.test(url),
  youtube: (url: string) => MATCH_URL_YOUTUBE.test(url),
  vimeo: (url: string) =>
    MATCH_URL_VIMEO.test(url) && !VIDEO_EXTENSIONS.test(url) && !HLS_EXTENSIONS.test(url),
  wistia: (url: string) => MATCH_URL_WISTIA.test(url),
};
