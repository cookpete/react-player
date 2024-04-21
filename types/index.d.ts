import BaseReactPlayer, { BaseReactPlayerProps } from './base.js'

import { DailyMotionConfig } from './dailymotion.js'
import { FacebookConfig } from './facebook.js'
import { FileConfig } from './file.js'
import { MixcloudConfig } from './mixcloud.js'
import { SoundCloudConfig } from './soundcloud.js'
import { TwitchConfig } from './twitch.js'
import { VidyardConfig } from './vidyard.js'
import { VimeoConfig } from './vimeo.js'
import { WistiaConfig } from './wistia.js'
import { YouTubeConfig } from './youtube.js'

export interface Config {
  soundcloud?: SoundCloudConfig
  youtube?: YouTubeConfig
  facebook?: FacebookConfig
  dailymotion?: DailyMotionConfig
  vimeo?: VimeoConfig
  file?: FileConfig
  wistia?: WistiaConfig
  mixcloud?: MixcloudConfig
  vidyard?: VidyardConfig
  twitch?: TwitchConfig
}

export interface ReactPlayerProps extends BaseReactPlayerProps {
  config?: Config
}

export default class ReactPlayer extends BaseReactPlayer<ReactPlayerProps> {}
