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
  const getActivePlayer = (src: string) => {
    for (const player of [...customPlayers, ...players]) {
      if (player.canPlay(src)) {
        return player;
      }
    }
    if (playerFallback) {
      return playerFallback;
    }
    return null;
  };

  const ReactPlayer: ReactPlayer = React.forwardRef((_props, ref) => {
    const props = merge(defaultProps, _props);

    const { className, src, style, width, height, fallback, wrapper } = props;
    const [showPreview, setShowPreview] = useState(!!props.light);

    useEffect(() => {
      if (props.light) {
        setShowPreview(true);
      } else {
        setShowPreview(false);
      }
    }, [props.light]);

    const handleClickPreview = (e: React.SyntheticEvent) => {
      setShowPreview(false);
      props.onClickPreview?.(e);
    };

    const renderPreview = (src?: string) => {
      if (!src) return null;

      const { light, playIcon, previewTabIndex, oEmbedUrl, previewAriaLabel } = props;
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
      if (!src) return null;

      const player = getActivePlayer(src);
      if (!player) return null;

      const { style, width, height, wrapper } = props;
      const config = props.config?.[player.key as keyof ReactPlayerProps['config']];

      return (
        <Player
          {...props}
          ref={ref}
          activePlayer={player.player ?? (player as unknown as PlayerEntry['player'])}
          className={wrapper ? undefined : className}
          style={wrapper
            ? { display: 'block', width: '100%', height: '100%' }
            : { display: 'block', width, height, ...style }}
          config={config}
        />
      );
    };

    const Wrapper: ReactPlayerProps['wrapper'] =
      wrapper == null ? ForwardChildren : wrapper;

    const UniversalSuspense =
      fallback === false ? ForwardChildren : Suspense;

    return (
      <Wrapper className={className} style={{ width, height, ...style }}>
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
