import BaseReactPlayer, { BaseReactPlayerProps } from './base'

export interface MixcloudConfig {
  options?: Record<string, any>
}

export interface MixcloudPlayerProps extends BaseReactPlayerProps {
  config?: MixcloudConfig
}

export default class MixcloudPlayer extends BaseReactPlayer<MixcloudPlayerProps> {}
