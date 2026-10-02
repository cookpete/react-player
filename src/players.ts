import { lazy } from 'react';

import HtmlPlayer from './HtmlPlayer.js';
import { createMediaPlayer } from './MediaPlayer.js';
import { canPlay } from './patterns.js';
import { muxSource, wistiaSource, type ToMediaProps } from './sources.js';
import type { PlayerComponent } from './types.js';

export type PlayerEntry = {
  key: string;
  canPlay: (src: string) => boolean;
  canEnablePIP?: () => boolean;
  player?: PlayerComponent | LazyPlayer;
};

type LazyPlayer = React.LazyExoticComponent<PlayerComponent>;

/** Lazily loads a `@videojs/react` media component and adapts it to ReactPlayer's props. */
const lazyMedia = <P extends object>(
  load: () => Promise<React.ComponentType<P>>,
  toMediaProps?: ToMediaProps
): LazyPlayer => lazy(async () => ({ default: createMediaPlayer(await load(), toMediaProps) })) as LazyPlayer;

const Players: PlayerEntry[] = [
  {
    key: 'hls',
    canPlay: canPlay('hls'),
    canEnablePIP: () => true,
    player: lazyMedia(() =>
      import(/* webpackChunkName: 'reactPlayerHls' */ '@videojs/react/media/hlsjs-video').then((m) => m.HlsJsVideo)
    ),
  },
  {
    key: 'dash',
    canPlay: canPlay('dash'),
    canEnablePIP: () => true,
    player: lazyMedia(() =>
      import(/* webpackChunkName: 'reactPlayerDash' */ '@videojs/react/media/dash-video').then((m) => m.DashVideo)
    ),
  },
  {
    key: 'mux',
    canPlay: canPlay('mux'),
    canEnablePIP: () => true,
    player: lazyMedia(
      () => import(/* webpackChunkName: 'reactPlayerMux' */ '@videojs/react/media/mux-video').then((m) => m.MuxVideo),
      muxSource
    ),
  },
  {
    key: 'youtube',
    canPlay: canPlay('youtube'),
    player: lazyMedia(() =>
      import(/* webpackChunkName: 'reactPlayerYouTube' */ '@videojs/react/media/youtube-video').then(
        (m) => m.YouTubeVideo
      )
    ),
  },
  {
    key: 'vimeo',
    canPlay: canPlay('vimeo'),
    player: lazyMedia(() =>
      import(/* webpackChunkName: 'reactPlayerVimeo' */ '@videojs/react/media/vimeo-video').then((m) => m.VimeoVideo)
    ),
  },
  {
    key: 'wistia',
    canPlay: canPlay('wistia'),
    canEnablePIP: () => true,
    player: lazyMedia(
      () =>
        import(/* webpackChunkName: 'reactPlayerWistia' */ '@videojs/react/media/wistia-video').then(
          (m) => m.WistiaVideo
        ),
      wistiaSource
    ),
  },
  {
    key: 'spotify',
    canPlay: canPlay('spotify'),
    canEnablePIP: () => false,
    player: lazyMedia(() =>
      import(/* webpackChunkName: 'reactPlayerSpotify' */ '@videojs/react/media/spotify-audio').then(
        (m) => m.SpotifyAudio
      )
    ),
  },
  {
    key: 'twitch',
    canPlay: canPlay('twitch'),
    canEnablePIP: () => false,
    player: lazyMedia(() =>
      import(/* webpackChunkName: 'reactPlayerTwitch' */ '@videojs/react/media/twitch-video').then((m) => m.TwitchVideo)
    ),
  },
  {
    key: 'tiktok',
    canPlay: canPlay('tiktok'),
    canEnablePIP: () => false,
    player: lazyMedia(() =>
      import(/* webpackChunkName: 'reactPlayerTiktok' */ '@videojs/react/media/tiktok-video').then((m) => m.TikTokVideo)
    ),
  },
  {
    key: 'html',
    canPlay: canPlay('html'),
    canEnablePIP: () => true,
    player: HtmlPlayer,
  },
];

export default Players;
