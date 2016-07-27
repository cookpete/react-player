import 'es6-promise'
import React, { Component } from 'react'

import { propTypes, defaultProps } from './props'
import players from './players'

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
  componentWillReceiveProps (nextProps) {
    if (this.props.playing && !nextProps.playing) {
      clearTimeout(this.progressTimeout)
    }
    if (!this.props.playing && nextProps.playing) {
      this.progress()
    }
  }
  componentWillUnmount () {
    clearTimeout(this.progressTimeout)
  }
  shouldComponentUpdate (nextProps) {
    return (
      this.props.url !== nextProps.url ||
      this.props.playing !== nextProps.playing ||
      this.props.volume !== nextProps.volume ||
      this.props.height !== nextProps.height ||
      this.props.width !== nextProps.width
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
      const loaded = this.refs.player.getFractionLoaded() || 0
      const played = this.refs.player.getFractionPlayed() || 0
      if (loaded !== this.prevLoaded || played !== this.prevPlayed) {
        this.props.onProgress({ loaded, played })
        this.prevLoaded = loaded
        this.prevPlayed = played
      }
    }
    this.progressTimeout = setTimeout(this.progress, this.props.progressFrequency)
  }
  renderPlayer = Player => {
    const active = Player.canPlay(this.props.url)
    const { youtubeConfig, soundcloudConfig, vimeoConfig, fileConfig, ...activeProps } = this.props
    const props = active ? { ...activeProps, ref: 'player' } : {}
    return (
      <Player
        key={Player.displayName}
        youtubeConfig={youtubeConfig}
        soundcloudConfig={soundcloudConfig}
        vimeoConfig={vimeoConfig}
        fileConfig={fileConfig}
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
