import BaseReactPlayer, { BaseReactPlayerProps } from './base'

export interface SpotifyConfig {
  width?: number | string
  height?: number | string
}

export interface SpotifyPlayerProps extends BaseReactPlayerProps {
  config?: SpotifyConfig
}

export default class SpotifyPlayer extends BaseReactPlayer<SpotifyPlayerProps> {}
