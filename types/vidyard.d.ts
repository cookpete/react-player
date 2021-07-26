import BaseReactPlayer, { BaseReactPlayerProps } from './base'

export interface VidyardConfig {
  options?: Record<string, object>
}

export interface VidyardPlayerProps extends BaseReactPlayerProps {
  config?: VidyardConfig
}

export default class VidyardPlayer extends BaseReactPlayer<VidyardPlayerProps> {}
