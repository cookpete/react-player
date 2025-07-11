import type { MediaHTMLAttributes, SyntheticEvent } from 'react';
import type HlsVideoElement from 'hls-video-element';
import type SpotifyAudioElement from 'spotify-audio-element';
import type YouTubeVideoElement from 'youtube-video-element';
import type VimeoVideoElement from 'vimeo-video-element';
import type TwitchVideoElement from 'twitch-video-element';

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

export interface Config {
  dash?: Record<string, unknown>;
  hls?: HlsVideoElement['config'];
  html?: Record<string, unknown>;
  mux?: Record<string, unknown>;
  spotify?: SpotifyAudioElement['config'];
  twitch?: TwitchVideoElement['config'];
  vimeo?: VimeoVideoElement['config'];
  wistia?: Record<string, unknown>;
  youtube?: YouTubeVideoElement['config'];
}
