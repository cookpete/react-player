import type { ReactPlayerProps } from './types.js';

export const defaultProps: ReactPlayerProps = {
  // native video attrs
  src: '',
  muted: false,
  loop: false,
  controls: false,
  playsInline: false,
  width: '640px',
  height: '360px',

  // native video props
  volume: 1,
  playbackRate: 1,

  // custom props
  playing: false,
  pip: false,
  light: false,
  fallback: null,
  wrapper: 'div',
  previewTabIndex: 0,
  previewAriaLabel: '',
  oEmbedUrl: 'https://noembed.com/embed?url={url}',
};
