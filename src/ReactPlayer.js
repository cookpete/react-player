import 'es6-promise'
import React, { Component } from 'react'

import { propTypes, defaultProps } from './props'
import YouTube from './players/YouTube'
import SoundCloud from './players/SoundCloud'
import Vimeo from './players/Vimeo'
import FilePlayer from './players/FilePlayer'

export default class ReactPlayer extends Component {
  static displayName = 'ReactPlayer'
  static propTypes = propTypes
  static defaultProps = defaultProps
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
  renderPlayers () {
    const { url, youtubeConfig, vimeoConfig } = this.props
    const players = []
    if (YouTube.canPlay(url)) {
      players.push(YouTube)
    } else if (SoundCloud.canPlay(url)) {
      players.push(SoundCloud)
    } else if (Vimeo.canPlay(url)) {
      players.push(Vimeo)
    } else if (url) {
      players.push(FilePlayer)
    }
    if (!YouTube.canPlay(url) && youtubeConfig.preload) {
      players.push(YouTube)
    }
    if (!Vimeo.canPlay(url) && vimeoConfig.preload) {
      players.push(Vimeo)
    }
    return players.map(this.renderPlayer)
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
      ...this.props.style,
      width: this.props.width,
      height: this.props.height
    }
    return (
      <div style={style} className={this.props.className} hidden={this.props.hidden}>
        {this.renderPlayers()}
      </div>
    )
  }
}
