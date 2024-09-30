import BaseReactPlayer, { BaseReactPlayerProps } from './base.js'

export interface StreamablePlayerProps extends BaseReactPlayerProps {}

export default class StreamablePlayer extends BaseReactPlayer<StreamablePlayerProps> {}
