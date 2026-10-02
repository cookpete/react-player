import React from 'react';

import { engineSource, type ToMediaProps } from './sources.js';
import type { VideoElementProps } from './types.js';

/**
 * Adapts a `@videojs/react` media component to ReactPlayer's `activePlayer` contract.
 *
 * The media components behave like the native `<video>` tag: they take the same attributes and
 * `on*` callbacks, and the same `ref` (the rendered element) and `mediaRef` (the object that plays
 * the media) as ReactPlayer, so both pass straight through.
 *
 * The only translation needed is ReactPlayer's `src` + `config` into the structured `source` the
 * v10 media take. v10 compares sources structurally, so a new object each render reloads nothing.
 */
export function createMediaPlayer<P extends object>(
  MediaComponent: React.ComponentType<P>,
  toMediaProps: ToMediaProps = engineSource
) {
  // The media components' own prop types differ per player; ReactPlayer passes a normalized set.
  const Media = MediaComponent as React.ComponentType<Record<string, unknown>>;

  const MediaPlayer = React.forwardRef<HTMLElement, VideoElementProps>(({ src, config, ...props }, ref) => (
    <Media {...props} {...toMediaProps(src, config)} ref={ref} />
  ));

  MediaPlayer.displayName = `MediaPlayer(${Media.displayName ?? Media.name ?? 'Media'})`;

  return MediaPlayer;
}
