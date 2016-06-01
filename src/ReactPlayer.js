import 'es6-promise'
import React, { Component } from 'react'

import { propTypes, defaultProps, defaultConfig } from './props'
import players from './players'
import { mergeDeep } from './utils'

export default class ReactPlayer extends Component {
  static displayName = 'ReactPlayer'
  static propTypes = propTypes
  static defaultProps = defaultProps
  static canPlay (url) {
    return players.some(player => player.canPlay(url))
  }
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
      this.props.volume !== nextProps.volume
    )
  }
  seekTo = fraction => {
    const player = this.refs.player
    if (player) {
      player.seekTo(fraction)
    }
  }
  progress = () => {
    if (this.props.url && this.refs.player) {
      let progress = {}
      const loaded = this.refs.player.getFractionLoaded()
      const played = this.refs.player.getFractionPlayed()
      if (loaded !== null && loaded !== this.prevLoaded) {
        progress.loaded = this.prevLoaded = loaded
      }
      if (played !== null && played !== this.prevPlayed && this.props.playing) {
        progress.played = this.prevPlayed = played
      }
      if (progress.loaded || progress.played) {
        this.props.onProgress(progress)
      }
    }
    this.progressTimeout = setTimeout(this.progress, this.props.progressFrequency)
  }
  renderPlayer = Player => {
    const active = Player.canPlay(this.props.url)
    const { config, ...activeProps } = this.props
    const props = active ? { ref: 'player', ...activeProps } : {}
    return (
      <Player
        key={Player.displayName}
        config={mergeDeep(defaultConfig, config)}
        {...props}
      />
    )
  }
  render () {
    const style = {
      width: this.props.width,
      height: this.props.height
    }
    return (
      <div style={style} className={this.props.className}>
        {players.map(this.renderPlayer)}
      </div>
    )
  }
}
