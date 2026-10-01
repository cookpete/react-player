import type { MediaHTMLAttributes, SyntheticEvent } from 'react';
import type { DashEngineConfig } from '@videojs/dash-video';
import type { HlsEngineConfig } from '@videojs/hlsjs-video';
import type { MuxSource } from '@videojs/mux-video';
import type { SpotifyEngineConfig } from '@videojs/spotify-audio';
import type { TikTokEngineConfig } from '@videojs/tiktok-video';
import type { TwitchEngineConfig } from '@videojs/twitch-video';
import type { VimeoEngineConfig } from '@videojs/vimeo-video';
import type { WistiaSource } from '@videojs/wistia-video';
import type { YouTubeEngineConfig } from '@videojs/youtube-video';

interface VideoHTMLAttributes<T> extends MediaHTMLAttributes<T> {
  height?: number | string | undefined;
  playsInline?: boolean | undefined;
  poster?: string | undefined;
  width?: number | string | undefined;
  disablePictureInPicture?: boolean | undefined;
  disableRemotePlayback?: boolean | undefined;
  onEnterPictureInPicture?: ((this: HTMLVideoElement, ev: Event) => void) | undefined;
  onLeavePictureInPicture?: ((this: HTMLVideoElement, ev: Event) => void) | undefined;
}

export interface VideoElementProps
  extends React.DetailedHTMLProps<VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement> {
  playbackRate?: number;
  volume?: number;
  config?: Config;
}

export interface ReactPlayerProps extends PreviewProps, VideoElementProps {
  config?: Config;
  fallback?: React.ReactNode;
  onReady?: () => void;
  onStart?: (event: SyntheticEvent<HTMLVideoElement>) => void;
  pip?: boolean;
  playing?: boolean;
  wrapper?: string | React.ComponentType<React.HTMLAttributes<HTMLDivElement>>;
}

export interface PreviewProps {
  src?: string;
  light?: boolean | string | React.ReactElement;
  oEmbedUrl?: string;
  onClickPreview?: (event: React.SyntheticEvent) => void;
  playIcon?: React.ReactNode;
  previewAriaLabel?: string;
  previewTabIndex?: number;
}

/**
 * Player-specific settings. Each key maps onto the options of the engine that plays that kind
 * of media (Video.js v10 `source.engine.*`), except `mux`, which takes the remaining
 * `MuxSource` options (`playback`, `poster`, `storyboard`, `drm`, `engine`, ...).
 */
export interface Config {
  dash?: DashEngineConfig['dashJs'];
  hls?: HlsEngineConfig['hlsJs'];
  html?: Record<string, unknown>;
  mux?: Omit<MuxSource, 'src' | 'playbackId'>;
  spotify?: SpotifyEngineConfig;
  tiktok?: TikTokEngineConfig;
  twitch?: TwitchEngineConfig;
  vimeo?: VimeoEngineConfig;
  wistia?: Omit<WistiaSource, 'mediaId'>;
  youtube?: YouTubeEngineConfig;
}
