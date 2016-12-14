import * as React from 'react';

export interface ReactPlayerProps {
  url?: string;
  playing?: boolean;
  loop?: boolean;
  controls?: boolean;
  volume?: number;
  playbackRate?: number;
  width?: string|number;
  height?: string|number;
  hidden?: boolean;
  className?: string;
  style?: Object;
  progressFrequency?: number;
  soundcloudConfig?: {
    clientId: string,
    showArtwork: boolean
  };
  youtubeConfig?: {
    playerVars: Object,
    preload: boolean
  };
  vimeoConfig?: {
    iframeParams: Object,
    preload: boolean
  };
  fileConfig?: {
    attributes: Object
  };
  onReady?(): void;
  onStart?(): void;
  onPlay?(): void;
  onPause?(): void;
  onBuffer?(): void;
  onEnded?(): void;
  onError?(error: any): void;
  onDuration?(duration: number): void;
  onProgress?(state: { played: number, loaded: number }): void;
}

export default class ReactPlayer extends React.Component<ReactPlayerProps, any>{
  seekTo(fraction: number): void;
}
