import BaseReactPlayer, { BaseReactPlayerProps } from './base'

export interface PeerTubeConfig {
  config?: Record<string, any>
}

export interface PeerTubePlayerProps extends BaseReactPlayerProps {
  config?: Record<string, any>
}

export default class PeerTubePlayer extends BaseReactPlayer<PeerTubePlayerProps> {}
