import BaseReactPlayer, { BaseReactPlayerProps } from './base'

export interface DailyMotionConfig {
  params?: Record<string, any>
}

export interface DailyMotionPlayerProps extends BaseReactPlayerProps {
  config?: DailyMotionConfig
}

export default class DailyMotionPlayer extends BaseReactPlayer<DailyMotionPlayerProps> {}
