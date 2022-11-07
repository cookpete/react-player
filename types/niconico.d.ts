import BaseReactPlayer, { BaseReactPlayerProps } from './base'

export interface NiconicoConfig {
  playerId?: string
  /** Whether to show comments or not. Default to true. */
  comment?: boolean
}

export interface NiconicoPlayerProps extends BaseReactPlayerProps {
  config?: NiconicoConfig
}

export default class NiconicoPlayer extends BaseReactPlayer<NiconicoPlayerProps> {}
