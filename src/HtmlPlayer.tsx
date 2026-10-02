import { useComposedRefs } from '@videojs/react';
import React from 'react';

import { AUDIO_EXTENSIONS } from './patterns.js';
import type { VideoElementProps } from './types.js';

// A native element both renders and plays the media, so it is both `ref` and `mediaRef`.
const HtmlPlayer = React.forwardRef<HTMLElement, VideoElementProps>(({ config, mediaRef, ...props }, ref) => {
  const Media = AUDIO_EXTENSIONS.test(`${props.src}`) ? 'audio' : 'video';
  return <Media {...props} ref={useComposedRefs(ref as React.Ref<HTMLVideoElement>, mediaRef)} />;
});

export default HtmlPlayer;
