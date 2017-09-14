import * as React from 'react';

export interface SourceProps {
  src: string;
  type: string;
}

export interface TrackProps {
  kind: string;
  src: string;
  srcLang: string;
  default?: boolean;
}

export interface SoundCloudConfig {
  options?: Object;
}

export interface YouTubeConfig {
  playerVars?: Object;
  preload?: boolean;
}

export interface FacebookConfig {
  appId: string;
}

export interface DailyMotionConfig {
  params?: Object;
  preload?: boolean;
}

export interface VimeoConfig {
  iframeParams?: Object;
  preload?: boolean;
}

export interface VidmeConfig {
  format?: string;
}

export interface WistiaConfig {
  options?: Object;
}

export interface FileConfig {
  attributes?: Object;
  tracks?: TrackProps[];
  forceAudio?: boolean;
  forceHLS?: boolean;
  forceDASH?: boolean;
}

export interface Config {
  soundcloud?: SoundCloudConfig;
  youtube?: YouTubeConfig;
  facebook?: FacebookConfig;
  dailymotion?: DailyMotionConfig;
  vimeo?: VimeoConfig;
  vidme?: VidmeConfig;
  file?: FileConfig;
  wistia?: WistiaConfig;
}

export interface ReactPlayerProps {
  url?: string | string[] | SourceProps[];
  playing?: boolean;
  loop?: boolean;
  controls?: boolean;
  volume?: number;
  muted?: boolean;
  playbackRate?: number;
  width?: string | number;
  height?: string | number;
  style?: Object;
  progressFrequency?: number;
  playsinline?: boolean;
  hidden?: boolean;
  className?: string;
  config?: Config;
  soundcloudConfig?: SoundCloudConfig;
  youtubeConfig?: YouTubeConfig;
  facebookConfig?: FacebookConfig;
  dailymotionConfig?: DailyMotionConfig;
  vimeoConfig?: VimeoConfig;
  vidmeConfig?: VidmeConfig;
  fileConfig?: FileConfig;
  wistiaConfig?: WistiaConfig;
  onReady?(): void;
  onStart?(): void;
  onPlay?(): void;
  onPause?(): void;
  onBuffer?(): void;
  onEnded?(): void;
  onError?(error: any): void;
  onDuration?(duration: number): void;
  onSeek?(seconds: number): void;
  onProgress?(state: { played: number, loaded: number }): void;
}

export default class ReactPlayer extends React.Component<ReactPlayerProps, any> {
  seekTo(fraction: number): void;
}
