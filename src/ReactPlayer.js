import React, { Component } from 'react'

import { propTypes, defaultProps, DEPRECATED_CONFIG_PROPS } from './props'
import { getConfig, omit } from './utils'
import Player from './Player'

import YouTube from './players/YouTube'
import SoundCloud from './players/SoundCloud'
import Vimeo from './players/Vimeo'
import Facebook from './players/Facebook'
import FilePlayer from './players/FilePlayer'
import Streamable from './players/Streamable'
import Vidme from './players/Vidme'
import Wistia from './players/Wistia'
import DailyMotion from './players/DailyMotion'
import Twitch from './players/Twitch'

const SUPPORTED_PROPS = Object.keys(propTypes)
const SUPPORTED_PLAYERS = [
  YouTube,
  SoundCloud,
  Vimeo,
  Facebook,
  Streamable,
  Vidme,
  Wistia,
  Twitch,
  DailyMotion
]

export default class ReactPlayer extends Component {
  static displayName = 'ReactPlayer'
  static propTypes = propTypes
  static defaultProps = defaultProps
  static canPlay = url => {
    const players = [...SUPPORTED_PLAYERS, FilePlayer]
    for (let Player of players) {
      if (Player.canPlay(url)) {
        return true
      }
    }
    return false
  }
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
      this.props.muted !== nextProps.muted ||
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
    return this.player.getCurrentTime()
  }
  getInternalPlayer = (key = 'player') => {
    if (!this.player) return null
    return this.player[key]
  }
  progress = () => {
    if (this.props.url && this.player && this.player.isReady) {
      const playedSeconds = this.player.getCurrentTime() || 0
      const loadedSeconds = this.player.getSecondsLoaded()
      const duration = this.player.getDuration()
      if (duration) {
        const progress = {
          playedSeconds,
          played: playedSeconds / duration
        }
        if (loadedSeconds !== null) {
          progress.loadedSeconds = loadedSeconds
          progress.loaded = loadedSeconds / duration
        }
        // Only call onProgress if values have changed
        if (progress.played !== this.prevPlayed || progress.loaded !== this.prevLoaded) {
          this.props.onProgress(progress)
        }
        this.prevPlayed = progress.played
        this.prevLoaded = progress.loaded
      }
    }
    this.progressTimeout = setTimeout(this.progress, this.props.progressFrequency)
  }
  renderActivePlayer (url) {
    if (!url) return null
    for (let Player of SUPPORTED_PLAYERS) {
      if (Player.canPlay(url)) {
        return this.renderPlayer(Player)
      }
    }
    // Fall back to FilePlayer if nothing else can play the URL
    return this.renderPlayer(FilePlayer)
  }
  renderPlayer = innerPlayer => {
    return (
      <Player
        {...this.props}
        ref={this.activePlayerRef}
        key={innerPlayer.displayName}
        config={this.config}
        innerPlayer={innerPlayer}
      />
    )
  }
  activePlayerRef = player => {
    this.player = player
  }
  wrapperRef = wrapper => {
    this.wrapper = wrapper
  }
  renderPreloadPlayers (url) {
    // Render additional players if preload config is set
    const preloadPlayers = []
    if (!YouTube.canPlay(url) && this.config.youtube.preload) {
      preloadPlayers.push(YouTube)
    }
    if (!Vimeo.canPlay(url) && this.config.vimeo.preload) {
      preloadPlayers.push(Vimeo)
    }
    if (!DailyMotion.canPlay(url) && this.config.dailymotion.preload) {
      preloadPlayers.push(DailyMotion)
    }
    return preloadPlayers.map(this.renderPreloadPlayer)
  }
  renderPreloadPlayer = innerPlayer => {
    return (
      <Player
        key={innerPlayer.displayName}
        config={this.config}
        innerPlayer={innerPlayer}
      />
    )
  }
  render () {
    const { url, style, width, height } = this.props
    const otherProps = omit(this.props, SUPPORTED_PROPS, DEPRECATED_CONFIG_PROPS)
    const activePlayer = this.renderActivePlayer(url)
    const preloadPlayers = this.renderPreloadPlayers(url)
    return (
      <div ref={this.wrapperRef} style={{ ...style, width, height }} {...otherProps}>
        {activePlayer}
        {preloadPlayers}
      </div>
    )
  }
}
