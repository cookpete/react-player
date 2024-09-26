import BaseReactPlayer, { BaseReactPlayerProps } from '../base'

import { DailyMotionConfig } from '../dailymotion'
import { FacebookConfig } from '../facebook'
import { FileConfig } from '../file'
import { MixcloudConfig } from '../mixcloud'
import { SoundCloudConfig } from '../soundcloud'
import { SpotifyConfig } from '../spotify'
import { TwitchConfig } from '../twitch'
import { VidyardConfig } from '../vidyard'
import { VimeoConfig } from '../vimeo'
import { WistiaConfig } from '../wistia'
import { YouTubeConfig } from '../youtube'

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
  spotify?: SpotifyConfig
}

export interface ReactPlayerProps extends BaseReactPlayerProps {
  config?: Config
}

export default class ReactPlayer extends BaseReactPlayer<ReactPlayerProps> {}
