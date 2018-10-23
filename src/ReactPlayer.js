import React, { Component } from 'react'

import { propTypes, defaultProps, DEPRECATED_CONFIG_PROPS } from './props'
import { getConfig, omit, isEqual } from './utils'
import players from './players'
import Player from './Player'
import { FilePlayer } from './players/FilePlayer'
import renderPreloadPlayers from './preload'

const SUPPORTED_PROPS = Object.keys(propTypes)

let customPlayers = []

export default class ReactPlayer extends Component {
  static addCustomPlayer = player => {
    customPlayers.push(player)
  }
  static removeCustomPlayers = () => {
    customPlayers = []
  }
  static displayName = 'ReactPlayer'
  static propTypes = propTypes
  static defaultProps = defaultProps
  static canPlay = url => {
    for (let Player of [ ...customPlayers, ...players ]) {
      if (Player.canPlay(url)) {
        return true
      }
    }
    return false
  }
  static canEnablePiP = url => {
    for (let Player of [ ...customPlayers, ...players ]) {
      if (Player.canEnablePiP(url)) {
        return true
      }
    }
    return false
  }
  config = getConfig(this.props, defaultProps, true)
  componentDidMount () {
    if (this.props.progressFrequency) {
      const message = 'ReactPlayer: %cprogressFrequency%c is deprecated, please use %cprogressInterval%c instead'
      console.warn(message, 'font-weight: bold', '', 'font-weight: bold', '')
    }
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
  getSecondsLoaded = () => {
    if (!this.player) return null
    return this.player.getSecondsLoaded()
  }
  getInternalPlayer = (key = 'player') => {
    if (!this.player) return null
    return this.player.getInternalPlayer(key)
  }
  seekTo = fraction => {
    if (!this.player) return null
    this.player.seekTo(fraction)
  }
  onReady = () => {
    this.props.onReady(this)
  }
  getActivePlayer (url) {
    for (let Player of [ ...customPlayers, ...players ]) {
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
        onReady={this.onReady}
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
