import BaseReactPlayer, { BaseReactPlayerProps } from './base'

export interface YouTubeConfig {
  playerVars?: Record<string, any>
  embedOptions?: Record<string, any>
  onUnstarted?: () => void
}

export interface YouTubePlayerProps extends BaseReactPlayerProps {
  config?: YouTubeConfig
}

export default class YouTubePlayer extends BaseReactPlayer<YouTubePlayerProps> {}
