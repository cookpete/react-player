import type { SyntheticEvent } from 'react';
import type { DashEngineConfig } from '@videojs/dash-video';
import type { HlsEngineConfig } from '@videojs/hlsjs-video';
import type { MuxSource } from '@videojs/mux-video';
import type { SpotifySourceEngineConfig } from '@videojs/spotify-audio';
import type { TikTokSourceEngineConfig } from '@videojs/tiktok-video';
import type { TwitchSourceEngineConfig } from '@videojs/twitch-video';
import type { VimeoSourceEngineConfig } from '@videojs/vimeo-video';
import type { WistiaSource } from '@videojs/wistia-video';
import type { YouTubeSourceEngineConfig } from '@videojs/youtube-video';

interface VideoHTMLAttributes<T> extends React.VideoHTMLAttributes<T> {
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
 * Settings for every player, in one object. Engine options are keyed by engine name, exactly like
 * Video.js v10's `source.engine`, and each player reads only its own key. `mux` and `wistia` take
 * the rest of those players' source options.
 */
export interface Config
  extends HlsEngineConfig,
    DashEngineConfig,
    YouTubeSourceEngineConfig,
    VimeoSourceEngineConfig,
    SpotifySourceEngineConfig,
    TwitchSourceEngineConfig,
    TikTokSourceEngineConfig {
  mux?: Omit<MuxSource, 'src' | 'playbackId' | 'engine'>;
  wistia?: Omit<WistiaSource, 'mediaId'>;
}
