import { lazy } from 'react';
import { canPlay } from './patterns.js';
import type { VideoElementProps } from './types.js';
import { createMediaPlayer } from './MediaPlayer.js';
import { engineSource, muxSource, wistiaSource, type ToMediaProps } from './sources.js';
import HtmlPlayer from './HtmlPlayer.js';

export type PlayerEntry = {
  key: string;
  name: string;
  canPlay: (src: string) => boolean;
  canEnablePIP?: () => boolean;
  player?:
    | React.ComponentType<VideoElementProps>
    | React.LazyExoticComponent<React.ComponentType<VideoElementProps>>;
};

type LazyPlayer = React.LazyExoticComponent<React.ComponentType<VideoElementProps>>;

/** Lazily loads a `@videojs/react` media component and adapts it to ReactPlayer's props. */
const lazyMedia = <P extends object>(
  load: () => Promise<React.ComponentType<P>>,
  toMediaProps: ToMediaProps
): LazyPlayer =>
  lazy(async () => ({ default: createMediaPlayer(await load(), toMediaProps) })) as LazyPlayer;

const Players: PlayerEntry[] = [
  {
    key: 'hls',
    name: 'hls.js',
    canPlay: canPlay.hls,
    canEnablePIP: () => true,
    player: lazyMedia(
      () =>
        import(/* webpackChunkName: 'reactPlayerHls' */ '@videojs/react/media/hlsjs-video').then(
          (m) => m.HlsJsVideo
        ),
      engineSource('hlsJs')
    ),
  },
  {
    key: 'dash',
    name: 'dash.js',
    canPlay: canPlay.dash,
    canEnablePIP: () => true,
    player: lazyMedia(
      () =>
        import(/* webpackChunkName: 'reactPlayerDash' */ '@videojs/react/media/dash-video').then(
          (m) => m.DashVideo
        ),
      engineSource('dashJs')
    ),
  },
  {
    key: 'mux',
    name: 'Mux',
    canPlay: canPlay.mux,
    canEnablePIP: () => true,
    player: lazyMedia(
      () =>
        import(/* webpackChunkName: 'reactPlayerMux' */ '@videojs/react/media/mux-video').then(
          (m) => m.MuxVideo
        ),
      muxSource
    ),
  },
  {
    key: 'youtube',
    name: 'YouTube',
    canPlay: canPlay.youtube,
    player: lazyMedia(
      () =>
        import(
          /* webpackChunkName: 'reactPlayerYouTube' */ '@videojs/react/media/youtube-video'
        ).then((m) => m.YouTubeVideo),
      engineSource('youtube')
    ),
  },
  {
    key: 'vimeo',
    name: 'Vimeo',
    canPlay: canPlay.vimeo,
    player: lazyMedia(
      () =>
        import(/* webpackChunkName: 'reactPlayerVimeo' */ '@videojs/react/media/vimeo-video').then(
          (m) => m.VimeoVideo
        ),
      engineSource('vimeo')
    ),
  },
  {
    key: 'wistia',
    name: 'Wistia',
    canPlay: canPlay.wistia,
    canEnablePIP: () => true,
    player: lazyMedia(
      () =>
        import(
          /* webpackChunkName: 'reactPlayerWistia' */ '@videojs/react/media/wistia-video'
        ).then((m) => m.WistiaVideo),
      wistiaSource
    ),
  },
  {
    key: 'spotify',
    name: 'Spotify',
    canPlay: canPlay.spotify,
    canEnablePIP: () => false,
    player: lazyMedia(
      () =>
        import(
          /* webpackChunkName: 'reactPlayerSpotify' */ '@videojs/react/media/spotify-audio'
        ).then((m) => m.SpotifyAudio),
      engineSource('spotify')
    ),
  },
  {
    key: 'twitch',
    name: 'Twitch',
    canPlay: canPlay.twitch,
    canEnablePIP: () => false,
    player: lazyMedia(
      () =>
        import(
          /* webpackChunkName: 'reactPlayerTwitch' */ '@videojs/react/media/twitch-video'
        ).then((m) => m.TwitchVideo),
      engineSource('twitch')
    ),
  },
  {
    key: 'tiktok',
    name: 'TikTok',
    canPlay: canPlay.tiktok,
    canEnablePIP: () => false,
    player: lazyMedia(
      () =>
        import(
          /* webpackChunkName: 'reactPlayerTiktok' */ '@videojs/react/media/tiktok-video'
        ).then((m) => m.TikTokVideo),
      engineSource('tiktok')
    ),
  },
  {
    key: 'html',
    name: 'html',
    canPlay: canPlay.html,
    canEnablePIP: () => true,
    player: HtmlPlayer,
  },
];

export default Players;
