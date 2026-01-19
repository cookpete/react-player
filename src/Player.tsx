import React, { useCallback, useEffect, useRef } from 'react';
import type { SyntheticEvent } from 'react';
import type { PlayerEntry } from './players.js';
import type { ReactPlayerProps } from './types.js';

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const ensureLoadedIfNeeded = async (player: any) => {
  // Some custom-element based players (eg. twitch-video-element) require an async `load()`
  // to create their internal iframe before `play()` can be called safely.
  if (typeof player?.load !== 'function') return;

  try {
    // Call load() first - it may create a new loadComplete promise
    player.load();
    
    // Wait for loadComplete to resolve (the embed sends a "ready" event)
    const maybeLoadComplete = player.loadComplete;
    if (typeof maybeLoadComplete?.then === 'function') {
      // Wait longer for Twitch embeds which can take time to initialize
      // and may fail with 404 if the video URL is invalid
      await Promise.race([maybeLoadComplete, wait(5000)]);
    }
    
    // For Twitch player, also check readyState to ensure it's actually ready
    // readyState >= 1 means metadata is loaded, >= 3 means can play
    if (typeof player.readyState === 'number' && player.readyState < 1) {
      // Wait a bit more and check again
      await wait(500);
      // If still not ready after waiting, the video might be invalid
      if (player.readyState < 1) {
        throw new Error('Player not ready - video may be unavailable');
      }
    }
  } catch (err) {
    // Re-throw so caller knows the player isn't ready
    throw err;
  }
};

type Player = React.ForwardRefExoticComponent<
  ReactPlayerProps & {
    activePlayer: PlayerEntry['player'];
  }
>;

const Player: Player = React.forwardRef((props, ref) => {
  const { playing, pip } = props;

  const Player = props.activePlayer;
  // NOTE: many of our "players" are custom elements rather than HTMLVideoElement.
  // Keep the ref broad and interact with it defensively.
  const playerRef = useRef<any>(null);
  const startOnPlayRef = useRef(true);
  const playTokenRef = useRef(0);
  const playingRef = useRef<ReactPlayerProps['playing']>(playing);
  playingRef.current = playing;

  useEffect(() => {
    if (!playerRef.current) return;

    // Use strict equality for `playing`, if it's nullish, don't do anything.
    if (playerRef.current.paused && playing === true) {
      const player = playerRef.current;
      const token = ++playTokenRef.current;
      (async () => {
        try {
          await ensureLoadedIfNeeded(player);
          if (playTokenRef.current !== token) return;
          if (playingRef.current !== true) return;
          
          // Check if player is actually ready before attempting play
          // For custom elements like Twitch, readyState should be >= 1
          if (typeof player.readyState === 'number' && player.readyState < 1) {
            // Player isn't ready - this might indicate the video URL is invalid
            // Dispatch an error event so the error handler can catch it
            const errorEvent = new Event('error', { bubbles: true, cancelable: true });
            Object.defineProperty(errorEvent, 'target', { value: player, enumerable: true });
            player.dispatchEvent?.(errorEvent);
            return;
          }
          
          await player.play?.();
        } catch (err) {
          // Surface play errors - don't silently ignore them
          // This allows the onError handler to catch issues like invalid video URLs
          const errorEvent = new Event('error', { bubbles: true, cancelable: true });
          Object.defineProperty(errorEvent, 'target', { 
            value: player, 
            enumerable: true,
            writable: false
          });
          if (err instanceof Error) {
            Object.defineProperty(errorEvent, 'error', { 
              value: err, 
              enumerable: true,
              writable: false
            });
          }
          player.dispatchEvent?.(errorEvent);
        }
      })();
    }
    if (playing === false) {
      try {
        // Cancel any pending async play() call.
        playTokenRef.current++;
        playerRef.current.pause?.();
      } catch {}
    }

    try {
      playerRef.current.playbackRate = props.playbackRate ?? 1;
      playerRef.current.volume = props.volume ?? 1;
    } catch {}
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
        (node: any) => {
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
