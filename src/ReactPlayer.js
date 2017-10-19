import React, { Component } from 'react'

import { propTypes, defaultProps, DEPRECATED_CONFIG_PROPS } from './props'
import { getConfig, omit } from './utils'
import players from './players'
import Player from './Player'
import PreloadPlayers from './PreloadPlayers'

const SUPPORTED_PROPS = Object.keys(propTypes)

export default class ReactPlayer extends Component {
  static displayName = 'ReactPlayer'
  static propTypes = propTypes
  static defaultProps = defaultProps
  static canPlay = url => {
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
  getActivePlayer (url) {
    if (!url) return null
    for (let Player of players) {
      if (Player.canPlay(url)) {
        return Player
      }
    }
    // Fall back to FilePlayer if nothing else can play the URL
    return FilePlayer
  }
  activePlayerRef = player => {
    this.player = player
  }
  wrapperRef = wrapper => {
    this.wrapper = wrapper
  }
  render () {
    const { url, style, width, height } = this.props
    const otherProps = omit(this.props, SUPPORTED_PROPS, DEPRECATED_CONFIG_PROPS)
    const innerPlayer = this.getActivePlayer(url)
    return (
      <div ref={this.wrapperRef} style={{ ...style, width, height }} {...otherProps}>
        {innerPlayer &&
          <Player
            {...this.props}
            ref={this.activePlayerRef}
            key={innerPlayer.displayName}
            config={this.config}
            innerPlayer={innerPlayer}
          />
        }
        <PreloadPlayers
          url={url}
          config={this.config}
        />
      </div>
    )
  }
}
