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
  playerOptions?: Object;
  preload?: boolean;
}

export interface WistiaConfig {
  options?: Object;
}

export interface MixcloudConfig {
  options?: Object;
}

export interface FileConfig {
  attributes?: Object;
  tracks?: TrackProps[];
  forceVideo?: boolean;
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
  file?: FileConfig;
  wistia?: WistiaConfig;
  mixcloud?: MixcloudConfig;
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
  progressInterval?: number;
  playsinline?: boolean;
  wrapper?: any;
  config?: Config;
  soundcloudConfig?: SoundCloudConfig;
  youtubeConfig?: YouTubeConfig;
  facebookConfig?: FacebookConfig;
  dailymotionConfig?: DailyMotionConfig;
  vimeoConfig?: VimeoConfig;
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
  onProgress?(state: { played: number, playedSeconds: number, loaded: number, loadedSeconds: number }): void;
  [otherProps: string]: any;
}

export default class ReactPlayer extends React.Component<ReactPlayerProps, any> {
  static canPlay(url: string): boolean;
  seekTo(fraction: number): void;
  getCurrentTime(): number;
  getDuration(): number;
  getInternalPlayer(key?: string): Object;
}
