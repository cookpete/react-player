import BaseReactPlayer, { BaseReactPlayerProps } from './base'

export interface TrackProps {
  kind: string
  src: string
  srcLang: string
  label: string
  default?: boolean
}

export interface FileConfig {
  attributes?: Record<string, any>
  tracks?: TrackProps[]
  forceVideo?: boolean
  forceAudio?: boolean
  forceHLS?: boolean
  forceSafariHLS?: boolean
  forceDisableHls?: boolean
  forceDASH?: boolean
  forceFLV?: boolean
  hlsOptions?: Record<string, any>
  hlsVersion?: string
  hlsSdkUrl?: string
  dashVersion?: string
  dashSdkUrl?: string
  flvVersion?: string
  flvSdkUrl?: string
}

export interface FilePlayerProps extends BaseReactPlayerProps {
  config?: FileConfig
}

export default class FilePlayer extends BaseReactPlayer<FilePlayerProps> {}
