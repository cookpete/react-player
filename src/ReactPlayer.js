import React, { Component } from 'react'
import 'array.prototype.find'

import { propTypes, defaultProps } from './props'
import players from './players'

const PROGRESS_FREQUENCY = 500

export default class ReactPlayer extends Component {
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
      if (!this.prevLoaded || loaded !== this.prevLoaded) {
        progress.loaded = this.prevLoaded = loaded
      }
      if (!this.prevPlayed || played !== this.prevPlayed) {
        progress.played = this.prevPlayed = played
      }
      if (progress.loaded || progress.played) {
        this.props.onProgress(progress)
      }
    }
    this.progressTimeout = setTimeout(this.progress, PROGRESS_FREQUENCY)
  }
  renderPlayer = Player => {
    const active = Player.canPlay(this.props.url)
    const { youtubeConfig, soundcloudConfig, vimeoConfig, ...activeProps } = this.props
    const props = active ? { ...activeProps, ref: 'player' } : {}
    return (
      <Player
        key={Player.name}
        youtubeConfig={youtubeConfig}
        soundcloudConfig={soundcloudConfig}
        vimeoConfig={vimeoConfig}
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
      <div style={style}>
        { players.map(this.renderPlayer) }
      </div>
    )
  }
}
