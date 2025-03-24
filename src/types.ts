import type { MediaHTMLAttributes, SyntheticEvent } from 'react';

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
  html?: Record<string, unknown>;
  hls?: Record<string, unknown>;
  dash?: Record<string, unknown>;
  mux?: Record<string, unknown>;
  youtube?: Record<string, unknown>;
  vimeo?: Record<string, unknown>;
  wistia?: Record<string, unknown>;
}
