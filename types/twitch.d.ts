import BaseReactPlayer, { BaseReactPlayerProps } from './base.js'

export interface TwitchConfig {
  options?: Record<string, any>
  playerId?: string
}

export interface TwitchPlayerProps extends BaseReactPlayerProps {
  config?: TwitchConfig
}

export default class TwitchPlayer extends BaseReactPlayer<TwitchPlayerProps> {}
