import * as React from 'react';

export interface SourceProps {
  src: string;
  type: string;
}

export interface TrackProps {
  kind: string;
  src: string;
  srcLang: string;
  label: string;
  default?: boolean;
}

export interface SoundCloudConfig {
  options?: Object;
}

export interface YouTubeConfig {
  playerVars?: Object;
  embedOptions?: Object;
  onUnstarted?(): void;
}

export interface FacebookConfig {
  appId: string;
  version: string;
  playerId: string;
}

export interface DailyMotionConfig {
  params?: Object;
}

export interface VimeoConfig {
  playerOptions?: Object;
}

export interface WistiaConfig {
  options?: Object;
  playerId?: string;
}

export interface MixcloudConfig {
  options?: Object;
}

export interface VidyardConfig {
  options?: Object;
}

export interface FileConfig {
  attributes?: Object;
  tracks?: TrackProps[];
  forceVideo?: boolean;
  forceAudio?: boolean;
  forceHLS?: boolean;
  forceDASH?: boolean;
  hlsOptions?: Object;
  hlsVersion?: string;
  dashVersion?: string;
}

export interface TwitchConfig {
  options?: Object;
  playerId?: string;
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
  vidyard?: VidyardConfig;
  twitch?: TwitchConfig;
}

export interface ReactPlayerProps {
  url?: string | string[] | SourceProps[] | MediaStream;
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
  playIcon?: React.ReactElement;
  pip?: boolean;
  stopOnUnmount?: boolean;
  light?: boolean | string;
  wrapper?: any;
  config?: Config;
  onReady?(player: ReactPlayer): void;
  onStart?(): void;
  onPlay?(): void;
  onPause?(): void;
  onBuffer?(): void;
  onBufferEnd?(): void;
  onEnded?(): void;
  onEnablePIP?(): void;
  onDisablePIP?(): void;
  onError?(error: any, data?: any, hlsInstance?: any, hlsGlobal?: any): void;
  onDuration?(duration: number): void;
  onSeek?(seconds: number): void;
  onProgress?(state: { played: number, playedSeconds: number, loaded: number, loadedSeconds: number }): void;
  [otherProps: string]: any;
}

export default class ReactPlayer extends React.Component<ReactPlayerProps, any> {
  static canPlay(url: string): boolean;
  static canEnablePIP(url: string): boolean;
  static addCustomPlayer(player: ReactPlayer): void;
  static removeCustomPlayers(): void;
  seekTo(amount: number, type?: 'seconds' | 'fraction'): void;
  getCurrentTime(): number;
  getSecondsLoaded(): number;
  getDuration(): number;
  getInternalPlayer(key?: string): Object;
  showPreview(): void;
}
