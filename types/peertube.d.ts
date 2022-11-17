import BaseReactPlayer, { BaseReactPlayerProps } from './base'

export type PeerTubeConfig = Record<string, any>

export interface PeerTubePlayerProps extends BaseReactPlayerProps {
  config?: PeerTubeConfig
}

export default class PeerTubePlayer extends BaseReactPlayer<PeerTubePlayerProps> {}
