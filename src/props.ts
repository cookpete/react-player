import type { ReactPlayerProps } from './types.js';

export const defaultProps: ReactPlayerProps = {
  // Falsy values don't need to be defined
  //
  // native video attrs
  // src: undefined,
  // preload: undefined,
  // crossOrigin: undefined,
  // autoPlay: false,
  // muted: false,
  // loop: false,
  // controls: false,
  // playsInline: false,
  width: '320px',
  height: '180px',

  // native video props
  volume: 1,
  playbackRate: 1,

  // custom props
  // playing: undefined,
  // pip: false,
  // light: false,
  // fallback: null,
  previewTabIndex: 0,
  previewAriaLabel: '',
  oEmbedUrl: 'https://noembed.com/embed?url={url}',
};
