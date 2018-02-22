import React, { Component } from 'react'

import { propTypes, defaultProps, DEPRECATED_CONFIG_PROPS } from './props'
import { getConfig, omit, isEqual } from './utils'
import players from './players'
import Player from './Player'
import FilePlayer from './players/FilePlayer'
import renderPreloadPlayers from './preload'

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
    if (this.props.progressFrequency) {
      const message = 'ReactPlayer: %cprogressFrequency%c is deprecated, please use %cprogressInterval%c instead'
      console.warn(message, 'font-weight: bold', '', 'font-weight: bold', '')
    }
  }
  componentWillUnmount () {
    clearTimeout(this.progressTimeout)
  }
  shouldComponentUpdate (nextProps) {
    return !isEqual(this.props, nextProps)
  }
  componentWillUpdate (nextProps) {
    this.config = getConfig(nextProps, defaultProps)
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
    return this.player.getInternalPlayer(key)
  }
  seekTo = fraction => {
    if (!this.player) return null
    this.player.seekTo(fraction)
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
    this.progressTimeout = setTimeout(this.progress, this.props.progressFrequency || this.props.progressInterval)
  }
  getActivePlayer (url) {
    for (let Player of players) {
      if (Player.canPlay(url)) {
        return Player
      }
    }
    // Fall back to FilePlayer if nothing else can play the URL
    return FilePlayer
  }
  wrapperRef = wrapper => {
    this.wrapper = wrapper
  }
  activePlayerRef = player => {
    this.player = player
  }
  renderActivePlayer (url) {
    if (!url) return null
    const activePlayer = this.getActivePlayer(url)
    return (
      <Player
        {...this.props}
        key={activePlayer.displayName}
        ref={this.activePlayerRef}
        config={this.config}
        activePlayer={activePlayer}
      />
    )
  }
  sortPlayers (a, b) {
    // Retain player order to prevent weird iframe behaviour when switching players
    if (a && b) {
      return a.key < b.key ? -1 : 1
    }
    return 0
  }
  render () {
    const { url, style, width, height, wrapper: Wrapper } = this.props
    const otherProps = omit(this.props, SUPPORTED_PROPS, DEPRECATED_CONFIG_PROPS)
    const activePlayer = this.renderActivePlayer(url)
    const preloadPlayers = renderPreloadPlayers(url, this.config)
    const players = [ activePlayer, ...preloadPlayers ].sort(this.sortPlayers)
    return (
      <Wrapper ref={this.wrapperRef} style={{ ...style, width, height }} {...otherProps}>
        {players}
      </Wrapper>
    )
  }
}
