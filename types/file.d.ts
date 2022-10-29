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
  forceDASH?: boolean
  forceFLV?: boolean
  hlsOptions?: Record<string, any>
  hlsVersion?: string
  dashVersion?: string
  flvVersion?: string
  dashOptions?: Record<string, any>
  dashProtectionData: Record<string, any>
  useShakaforDASH?:boolean
  useShakaforHLS?:boolean
  shakaOptions?: Record<string, any>
  shakaVersion?: string
  shakaNetworkFilters?: (engine: any) => void;
  debug: boolean
}

export interface FilePlayerProps extends BaseReactPlayerProps {
  config?: FileConfig
}

export default class FilePlayer extends BaseReactPlayer<FilePlayerProps> {}
