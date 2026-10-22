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

  // Some media elements (e.g. YouTube, Vimeo) define their own `onSeeking` and `onSeeked`
  // methods, so passing these handlers as props would overwrite those methods instead of
  // adding event listeners. Attach them as native event listeners so every player
  // receives the actual event object.
  const seekHandlersRef = useRef({ onSeeking: props.onSeeking, onSeeked: props.onSeeked });
  seekHandlersRef.current = { onSeeking: props.onSeeking, onSeeked: props.onSeeked };

  const handleSeeking = useCallback((event: Event) => {
    seekHandlersRef.current.onSeeking?.(event as unknown as SyntheticEvent<HTMLVideoElement>);
  }, []);

  const handleSeeked = useCallback((event: Event) => {
    seekHandlersRef.current.onSeeked?.(event as unknown as SyntheticEvent<HTMLVideoElement>);
  }, []);

  const setPlayerRef = useCallback(
    (node: HTMLVideoElement) => {
      playerRef.current?.removeEventListener('seeking', handleSeeking);
      playerRef.current?.removeEventListener('seeked', handleSeeked);
      node?.addEventListener('seeking', handleSeeking);
      node?.addEventListener('seeked', handleSeeked);

      playerRef.current = node;

      if (typeof ref === 'function') {
        ref(node);
      } else if (ref !== null) {
        ref.current = node;
      }
    },
    [ref, handleSeeking, handleSeeked]
  );

  if (!Player) {
    return null;
  }

  // Filter out ReactPlayer-specific event handlers to prevent them from being passed down
  // to the underlying HTML video element, which causes React warnings about unknown
  // event handler properties
  const eventProps: Record<string, EventListenerOrEventListenerObject> = {};
  const reactPlayerEventHandlers = ['onReady', 'onStart', 'onSeeking', 'onSeeked'];

  for (const key in props) {
    if (key.startsWith('on') && !reactPlayerEventHandlers.includes(key)) {
      eventProps[key] = props[key as keyof typeof props] as EventListenerOrEventListenerObject;
    }
  }

  return (
    <Player
      {...eventProps}
      style={props.style}
      className={props.className}
      slot={props.slot}
      ref={setPlayerRef}
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
