import React, { useCallback, useEffect, useRef } from 'react';
import type { SyntheticEvent } from 'react';
import type { PlayerEntry } from './players.js';
import type { ReactPlayerProps } from './types.js';

type Player = React.ForwardRefExoticComponent<
  ReactPlayerProps & {
    activePlayer: PlayerEntry['player'];
  }
>;

const Player: Player = React.forwardRef((props, ref) => {
  const { playing, pip } = props;

  const Player = props.activePlayer;
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const startOnPlayRef = useRef(true);

  useEffect(() => {
    if (!playerRef.current) return;

    // Use strict equality for `playing`, if it's nullish, don't do anything.
    if (playerRef.current.paused && playing === true) {
      playerRef.current.play();
    }
    if (!playerRef.current.paused && playing === false) {
      playerRef.current.pause();
    }

    playerRef.current.playbackRate = props.playbackRate ?? 1;
    playerRef.current.volume = props.volume ?? 1;
  });

  useEffect(() => {
    if (!playerRef.current || !globalThis.document) return;

    if (pip && !document.pictureInPictureElement) {
      try {
        playerRef.current.requestPictureInPicture?.();
      } catch (err) {}
    }

    if (!pip && document.pictureInPictureElement) {
      try {
        // @ts-ignore
        playerRef.current.exitPictureInPicture?.();
        document.exitPictureInPicture?.();
      } catch (err) {}
    }
  }, [pip]);

  const handleLoadStart = (event: SyntheticEvent<HTMLVideoElement>) => {
    startOnPlayRef.current = true;
    props.onReady?.();
    props.onLoadStart?.(event);
  };

  const handlePlay = (event: SyntheticEvent<HTMLVideoElement>) => {
    if (startOnPlayRef.current) {
      startOnPlayRef.current = false;
      props.onStart?.(event);
    }
    props.onPlay?.(event);
  };

  if (!Player) {
    return null;
  }

  // Filter out ReactPlayer-specific event handlers to prevent them from being passed down
  // to the underlying HTML video element, which causes React warnings about unknown
  // event handler properties
  const eventProps: Record<string, EventListenerOrEventListenerObject> = {};
  const reactPlayerEventHandlers = ['onReady', 'onStart'];

  for (const key in props) {
    if (key.startsWith('on') && !reactPlayerEventHandlers.includes(key)) {
      eventProps[key] = props[key as keyof ReactPlayerProps];
    }
  }

  return (
    <Player
      {...eventProps}
      style={props.style}
      className={props.className}
      slot={props.slot}
      ref={useCallback(
        (node: HTMLVideoElement) => {
          playerRef.current = node;

          if (typeof ref === 'function') {
            ref(node);
          } else if (ref !== null) {
            ref.current = node;
          }
        },
        [ref]
      )}
      src={props.src}
      crossOrigin={props.crossOrigin}
      preload={props.preload}
      controls={props.controls}
      muted={props.muted}
      autoPlay={props.autoPlay}
      loop={props.loop}
      playsInline={props.playsInline}
      disableRemotePlayback={props.disableRemotePlayback}
      config={props.config}
      onLoadStart={handleLoadStart}
      onPlay={handlePlay}
    >
      {props.children}
    </Player>
  );
});

Player.displayName = 'Player';

export default Player;
