import React, { Component } from 'react'

import { propTypes, defaultProps } from './props'
import YouTube from './players/YouTube'
import SoundCloud from './players/SoundCloud'
import Vimeo from './players/Vimeo'
import FilePlayer from './players/FilePlayer'
import Streamable from './players/Streamable'
import Vidme from './players/Vidme'

export default class ReactPlayer extends Component {
  static displayName = 'ReactPlayer'
  static propTypes = propTypes
  static defaultProps = defaultProps
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
      this.props.height !== nextProps.height ||
      this.props.width !== nextProps.width ||
      this.props.hidden !== nextProps.hidden
    )
  }
  seekTo = fraction => {
    if (this.player) {
      this.player.seekTo(fraction)
    }
  }
  progress = () => {
    if (this.props.url && this.player) {
      const loaded = this.player.getFractionLoaded() || 0
      const played = this.player.getFractionPlayed() || 0
      const progress = {}
      if (loaded !== this.prevLoaded) {
        progress.loaded = loaded
      }
      if (played !== this.prevPlayed) {
        progress.played = played
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
    const { url, youtubeConfig, vimeoConfig } = this.props
    const players = []
    if (YouTube.canPlay(url)) {
      players.push(YouTube)
    } else if (SoundCloud.canPlay(url)) {
      players.push(SoundCloud)
    } else if (Vimeo.canPlay(url)) {
      players.push(Vimeo)
    } else if (Streamable.canPlay(url)) {
      players.push(Streamable)
    } else if (Vidme.canPlay(url)) {
      players.push(Vidme)
    } else if (url) {
      // Fall back to FilePlayer if nothing else can play the URL
      players.push(FilePlayer)
    }
    // Render additional players if preload config is set
    if (!YouTube.canPlay(url) && youtubeConfig.preload) {
      players.push(YouTube)
    }
    if (!Vimeo.canPlay(url) && vimeoConfig.preload) {
      players.push(Vimeo)
    }
    return players.map(this.renderPlayer)
  }
  ref = player => {
    this.player = player
  }
  renderPlayer = Player => {
    const active = Player.canPlay(this.props.url)
    const { youtubeConfig, soundcloudConfig, vimeoConfig, fileConfig, ...activeProps } = this.props
    const props = active ? { ...activeProps, ref: this.ref } : {}
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
    const { style, width, height, className, hidden } = this.props
    const players = this.renderPlayers()
    return (
      <div style={{ ...style, width, height }} className={className} hidden={hidden}>
        {players}
      </div>
    )
  }
}
