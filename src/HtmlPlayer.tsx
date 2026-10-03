import { useComposedRefs, useMediaAttach } from '@videojs/react';
import React from 'react';

import { AUDIO_EXTENSIONS } from './patterns.js';
import type { VideoElementProps } from './types.js';

// A native element both renders and plays the media, so it is both `ref` and `mediaRef`. Like v10's
// `Video`, it attaches to a surrounding v10 player, so extensions such as Mux Data and Google Cast see it.
const HtmlPlayer = React.forwardRef<HTMLElement, VideoElementProps>(({ config, mediaRef, ...props }, ref) => {
  const Media = AUDIO_EXTENSIONS.test(`${props.src}`) ? 'audio' : 'video';
  const setMedia = useMediaAttach();
  return <Media {...props} ref={useComposedRefs(ref as React.Ref<HTMLVideoElement>, mediaRef, setMedia)} />;
});

export default HtmlPlayer;
