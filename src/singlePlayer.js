import React, { Component } from 'react'

import { propTypes, defaultProps, DEPRECATED_CONFIG_PROPS } from './props'
import { getConfig, omit, isEqual } from './utils'
import Player from './Player'

const SUPPORTED_PROPS = Object.keys(propTypes)

export default function createSinglePlayer (activePlayer) {
  return class SinglePlayer extends Component {
    static displayName = `${activePlayer.displayName}Player`
    static propTypes = propTypes
    static defaultProps = defaultProps
    static canPlay = activePlayer.canPlay

    config = getConfig(this.props, defaultProps, true)
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
    seekTo = (fraction, type) => {
      if (!this.player) return null
      this.player.seekTo(fraction, type)
    }
    ref = player => {
      this.player = player
    }
    render () {
      const { forceVideo, forceAudio, forceHLS, forceDASH } = this.config.file
      const skipCanPlay = forceVideo || forceAudio || forceHLS || forceDASH
      if (!activePlayer.canPlay(this.props.url) && !skipCanPlay) {
        return null
      }
      const { style, width, height, wrapper: Wrapper } = this.props
      const otherProps = omit(this.props, SUPPORTED_PROPS, DEPRECATED_CONFIG_PROPS)
      return (
        <Wrapper style={{ ...style, width, height }} {...otherProps}>
          <Player
            {...this.props}
            ref={this.ref}
            activePlayer={activePlayer}
            config={this.config}
          />
        </Wrapper>
      )
    }
  }
}
