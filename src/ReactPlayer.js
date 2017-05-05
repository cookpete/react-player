import React, { Component } from 'react'
import omit from 'lodash.omit'

import { propTypes, defaultProps, DEPRECATED_CONFIG_PROPS } from './props'
import { getConfig } from './utils'
import YouTube from './players/YouTube'
import SoundCloud from './players/SoundCloud'
import Vimeo from './players/Vimeo'
import Facebook from './players/Facebook'
import FilePlayer from './players/FilePlayer'
import Streamable from './players/Streamable'
import Vidme from './players/Vidme'
import Wistia from './players/Wistia'
import DailyMotion from './players/DailyMotion'

const SUPPORTED_PROPS = Object.keys(propTypes)
const SUPPORTED_PLAYERS = [
  YouTube,
  SoundCloud,
  Vimeo,
  Facebook,
  FilePlayer,
  Streamable,
  Vidme,
  Wistia,
  DailyMotion
]

export default class ReactPlayer extends Component {
  static displayName = 'ReactPlayer'
  static propTypes = propTypes
  static defaultProps = defaultProps
  config = getConfig(this.props, defaultProps, true)
  componentDidMount () {
    this.progress()
  }
  componentWillUnmount () {
    clearTimeout(this.progressTimeout)
  }
  shouldComponentUpdate (nextProps) {
    return (
      this.props.url !== nextProps.url ||
      this.props.playing !== nextProps.playing ||
      this.props.volume !== nextProps.volume ||
      this.props.playbackRate !== nextProps.playbackRate ||
      this.props.height !== nextProps.height ||
      this.props.width !== nextProps.width ||
      this.props.hidden !== nextProps.hidden
    )
  }
  seekTo = fraction => {
    if (!this.player) return null
    this.player.seekTo(fraction)
  }
  getDuration = () => {
    if (!this.player) return null
    return this.player.getDuration()
  }
  getCurrentTime = () => {
    if (!this.player) return null
    const duration = this.player.getDuration()
    const fractionPlayed = this.player.getFractionPlayed()
    if (duration === null || fractionPlayed === null) {
      return null
    }
    return fractionPlayed * duration
  }
  progress = () => {
    if (this.props.url && this.player) {
      const loaded = this.player.getFractionLoaded() || 0
      const played = this.player.getFractionPlayed() || 0
      const duration = this.player.getDuration()
      const progress = {}
      if (loaded !== this.prevLoaded) {
        progress.loaded = loaded
        if (duration) {
          progress.loadedSeconds = progress.loaded * duration
        }
      }
      if (played !== this.prevPlayed) {
        progress.played = played
        if (duration) {
          progress.playedSeconds = progress.played * duration
        }
      }
      if (progress.loaded || progress.played) {
        this.props.onProgress(progress)
      }
      this.prevLoaded = loaded
      this.prevPlayed = played
    }
    this.progressTimeout = setTimeout(this.progress, this.props.progressFrequency)
  }
  renderPlayers () {
    // Build array of players to render based on URL and preload config
    const { url } = this.props
    const renderPlayers = []
    for (let Player of SUPPORTED_PLAYERS) {
      if (Player.canPlay(url)) {
        renderPlayers.push(Player)
      }
    }
    // Fall back to FilePlayer if nothing else can play the URL
    if (renderPlayers.length === 0) {
      renderPlayers.push(FilePlayer)
    }
    // Render additional players if preload config is set
    if (!YouTube.canPlay(url) && this.config.youtube.preload) {
      renderPlayers.push(YouTube)
    }
    if (!Vimeo.canPlay(url) && this.config.vimeo.preload) {
      renderPlayers.push(Vimeo)
    }
    if (!DailyMotion.canPlay(url) && this.config.dailymotion.preload) {
      renderPlayers.push(DailyMotion)
    }
    return renderPlayers.map(this.renderPlayer)
  }
  ref = player => {
    this.player = player
  }
  renderPlayer = Player => {
    const active = Player.canPlay(this.props.url)
    const props = active ? { ...this.props, ref: this.ref } : {}
    return (
      <Player
        {...props}
        key={Player.displayName}
        config={this.config}
      />
    )
  }
  render () {
    const { style, width, height } = this.props
    const otherProps = omit(this.props, SUPPORTED_PROPS, DEPRECATED_CONFIG_PROPS)
    const players = this.renderPlayers()
    return (
      <div style={{ ...style, width, height }} {...otherProps}>
        {players}
      </div>
    )
  }
}
