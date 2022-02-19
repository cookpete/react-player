import BaseReactPlayer, { BaseReactPlayerProps } from './base'

export interface FacebookConfig {
  appId?: string
  version?: string
  playerId?: string
  attributes?: object
}

export interface FacebookPlayerProps extends BaseReactPlayerProps {
  config?: FacebookConfig
}

export default class FacebookPlayer extends BaseReactPlayer<FacebookPlayerProps> {}
