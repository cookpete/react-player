import BaseReactPlayer, { BaseReactPlayerProps } from './base'

export interface SoundCloudConfig {
  options?: Record<string, any>
}

export interface SoundCloudPlayerProps extends BaseReactPlayerProps {
  config?: SoundCloudConfig
}

export default class SoundCloudPlayer extends BaseReactPlayer<SoundCloudPlayerProps> {}
