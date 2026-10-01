import React, { useMemo } from 'react';
import type { ToMediaProps } from './sources.js';
import type { VideoElementProps } from './types.js';

/**
 * Adapts a `@videojs/react` media component to ReactPlayer's `activePlayer` contract.
 *
 * The media components behave like the native `<video>` tag: they take the same attributes and
 * `on*` callbacks. Their `mediaRef` receives the object that plays the media (the `<video>` itself,
 * or the playback adapter of an embed), which is what ReactPlayer's `ref` exposes. The rendered
 * element of an embed stays reachable as `ref.current.target`.
 *
 * The only translation needed is ReactPlayer's `src` + player-specific `config` into the
 * structured `source` the v10 media take.
 */
export function createMediaPlayer<P extends object>(
  MediaComponent: React.ComponentType<P>,
  toMediaProps: ToMediaProps
) {
  // The media components' own prop types differ per player; ReactPlayer passes a normalized set.
  const Media = MediaComponent as React.ComponentType<Record<string, unknown>>;

  const MediaPlayer = React.forwardRef<HTMLVideoElement, VideoElementProps>((props, ref) => {
    const { src, config, playbackRate, volume, children, ...rest } = props;

    const sourceProps = useMemo(() => toMediaProps(src, config), [toMediaProps, src, config]);

    return (
      <Media {...rest} {...sourceProps} mediaRef={ref}>
        {children}
      </Media>
    );
  });

  MediaPlayer.displayName = `MediaPlayer(${Media.displayName ?? Media.name ?? 'Media'})`;

  return MediaPlayer;
}
