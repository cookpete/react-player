import React from 'react';
import { AUDIO_EXTENSIONS } from './patterns.js';
import type { HtmlPlayerConfig, VideoElementProps } from './types.js';

// `config` is a player option, not a media attribute. Spreading it onto the
// element renders config="[object Object]".
function attributesFrom(config: VideoElementProps['config']) {
  const attributes = (config as HtmlPlayerConfig | undefined)?.attributes;
  if (!attributes || typeof attributes !== 'object' || Array.isArray(attributes)) {
    return undefined;
  }
  return attributes;
}

// Player always passes its attribute allow-list. An omitted prop arrives as
// `undefined` and would otherwise wipe out the same key from config.html.attributes.
function definedProps<T extends object>(props: T) {
  return Object.fromEntries(
    Object.entries(props).filter(([, value]) => value !== undefined)
  ) as Partial<T>;
}

const HtmlPlayer = React.forwardRef<HTMLVideoElement, VideoElementProps>((props, ref) => {
  const { config, ...mediaProps } = props;
  const Media = AUDIO_EXTENSIONS.test(`${props.src}`) ? 'audio' : 'video';

  return (
    <Media {...attributesFrom(config)} {...definedProps(mediaProps)} ref={ref}>
      {props.children}
    </Media>
  );
});

export default HtmlPlayer;
