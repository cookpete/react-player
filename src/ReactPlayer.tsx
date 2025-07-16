import React, { lazy, Suspense, useEffect, useState } from 'react';
import merge from 'deepmerge';

import { defaultProps } from './props.js';
import Player from './Player.js';

import type { ReactPlayerProps } from './types.js';
import type { PlayerEntry } from './players.js';

const Preview = lazy(() => import(/* webpackChunkName: 'reactPlayerPreview' */ './Preview.js'));
const customPlayers: PlayerEntry[] = [];

type ReactPlayer = React.ForwardRefExoticComponent<
  Omit<ReactPlayerProps, 'ref'> & React.RefAttributes<HTMLVideoElement>
> &
  Partial<{
    addCustomPlayer: (player: PlayerEntry) => void;
    removeCustomPlayers: () => void;
    canPlay: (src: string) => boolean;
    canEnablePIP: (src: string) => boolean;
  }>;

export const createReactPlayer = (players: PlayerEntry[], playerFallback: PlayerEntry) => {
  const getActivePlayer = (src?: string) => {
    for (const player of [...customPlayers, ...players]) {
      if (src && player.canPlay(src)) {
        return player;
      }
    }
    if (playerFallback) {
      return playerFallback;
    }
    return null;
  };

  const ReactPlayer: ReactPlayer = React.forwardRef((
    { 
      children, 
      playIcon: _playIcon, 
      light: _light, 
      fallback: _fallback, 
      wrapper: _wrapper, 
      ..._props 
    }, 
    ref
  ) => {
    const { 
      playIcon: defaultPlayIcon, 
      light: defaultLight, 
      fallback: defaultFallback, 
      wrapper: defaultWrapper, 
      ..._defaultProps 
    } = defaultProps;
    const props = merge(_defaultProps, _props);

    // deepmerge does not handle React elements, so we need to extract and merge them manually
    const playIcon = _playIcon ?? defaultPlayIcon;
    const light = _light ?? defaultLight;
    const fallback = _fallback ?? defaultFallback;
    const wrapper = _wrapper ?? defaultWrapper;

    const { src, slot, className, style, width, height } = props;
    const [showPreview, setShowPreview] = useState(!!light);

    useEffect(() => {
      if (light) {
        setShowPreview(true);
      } else {
        setShowPreview(false);
      }
    }, [light]);

    const handleClickPreview = (e: React.SyntheticEvent) => {
      setShowPreview(false);
      props.onClickPreview?.(e);
    };

    const renderPreview = (src?: string) => {
      if (!src) return null;

      const {  previewTabIndex, oEmbedUrl, previewAriaLabel } = props;
      return (
        <Preview
          src={src}
          light={light}
          playIcon={playIcon}
          previewTabIndex={previewTabIndex}
          previewAriaLabel={previewAriaLabel}
          oEmbedUrl={oEmbedUrl}
          onClickPreview={handleClickPreview}
        />
      );
    };

    const renderActivePlayer = (src?: string) => {
      const player = getActivePlayer(src);
      if (!player) return null;

      const { style, width, height } = props;
      const config = props.config?.[player.key as keyof ReactPlayerProps['config']];

      return (
        <Player
          {...props}
          playIcon={playIcon}
          light={light}
          fallback={fallback}
          wrapper={wrapper}
          ref={ref}
          activePlayer={player.player ?? (player as unknown as PlayerEntry['player'])}
          slot={wrapper ? undefined : slot}
          className={wrapper ? undefined : className}
          style={wrapper
            ? { display: 'block', width: '100%', height: '100%' }
            : { display: 'block', width, height, ...style }}
          config={config}
        >{children}</Player>
      );
    };

    const Wrapper: ReactPlayerProps['wrapper'] =
      wrapper == null ? ForwardChildren : wrapper;

    const UniversalSuspense =
      fallback === false ? ForwardChildren : Suspense;

    return (
      <Wrapper slot={slot} className={className} style={{ width, height, ...style }}>
        <UniversalSuspense fallback={fallback}>
          {showPreview ? renderPreview(src) : renderActivePlayer(src)}
        </UniversalSuspense>
      </Wrapper>
    );
  });

  ReactPlayer.displayName = 'ReactPlayer';

  ReactPlayer.addCustomPlayer = (player: PlayerEntry) => {
    customPlayers.push(player);
  };

  ReactPlayer.removeCustomPlayers = () => {
    customPlayers.length = 0;
  };

  ReactPlayer.canPlay = (src?: string) => {
    if (src) {
      for (const Player of [...customPlayers, ...players]) {
        if (Player.canPlay(src)) {
          return true;
        }
      }
    }
    return false;
  };

  ReactPlayer.canEnablePIP = (src?: string) => {
    if (src) {
      for (const Player of [...customPlayers, ...players]) {
        if (Player.canPlay(src) && Player.canEnablePIP?.()) {
          return true;
        }
      }
    }
    return false;
  };

  return ReactPlayer;
};

const ForwardChildren = ({ children }: { children?: React.ReactNode }) => children;
