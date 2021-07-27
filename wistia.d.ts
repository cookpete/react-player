import BaseReactPlayer, { BaseReactPlayerProps } from './base'

export interface WistiaConfig {
  options?: Record<string, any>
  playerId?: string
  customControls?: any[]
}

export interface WistiaPlayerProps extends BaseReactPlayerProps {
  config?: WistiaConfig
}

export default class WistiaPlayer extends BaseReactPlayer<WistiaPlayerProps> {}
