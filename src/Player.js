import React, { Component } from 'react'

import { propTypes, defaultProps } from './props'

const SEEK_ON_PLAY_EXPIRY = 5000

export default class Player extends Component {
  static displayName = 'Player'
  static propTypes = propTypes
  static defaultProps = defaultProps
  mounted = false
  isReady = false
  isPlaying = false // Track playing state internally to prevent bugs
  isLoading = true // Use isLoading to prevent onPause when switching URL
  startOnPlay = true
  seekOnPlay = null
  onDurationCalled = false
  componentDidMount () {
    this.mounted = true
    this.player.load(this.props.url)
  }
  componentWillUnmount () {
    if (this.isReady) {
      this.player.stop()
    }
    this.mounted = false
  }
  componentWillReceiveProps (nextProps) {
    // Invoke player methods based on incoming props
    const { url, playing, volume, muted, playbackRate } = this.props
    if (url !== nextProps.url) {
      this.isLoading = true
      this.onDurationCalled = false
      this.player.load(nextProps.url, this.isReady)
    }
    if (!playing && nextProps.playing && !this.isPlaying) {
      this.player.play()
    }
    if (playing && !nextProps.playing && this.isPlaying) {
      this.player.pause()
    }
    if (volume !== nextProps.volume && !nextProps.muted) {
      this.player.setVolume(nextProps.volume)
    }
    if (muted !== nextProps.muted) {
      this.player.setVolume(nextProps.muted ? 0 : nextProps.volume)
    }
    if (playbackRate !== nextProps.playbackRate && this.player.setPlaybackRate) {
      this.player.setPlaybackRate(nextProps.playbackRate)
    }
  }
  getDuration () {
    if (!this.isReady) return null
    return this.player.getDuration()
  }
  getCurrentTime () {
    if (!this.isReady) return null
    return this.player.getCurrentTime()
  }
  getSecondsLoaded () {
    if (!this.isReady) return null
    return this.player.getSecondsLoaded()
  }
  getInternalPlayer = (key) => {
    if (!this.player) return null
    return this.player[key]
  }
  seekTo (amount) {
    // When seeking before player is ready, store value and seek later
    if (!this.isReady && amount !== 0) {
      this.seekOnPlay = amount
      setTimeout(() => {
        this.seekOnPlay = null
      }, SEEK_ON_PLAY_EXPIRY)
      return
    }
    if (amount > 0 && amount < 1) {
      // Convert fraction to seconds based on duration
      const duration = this.player.getDuration()
      if (!duration) {
        console.warn('ReactPlayer: could not seek using fraction – duration not yet available')
        return
      }
      this.player.seekTo(duration * amount)
      return
    }
    this.player.seekTo(amount)
  }
  onReady = () => {
    if (!this.mounted) return
    this.isReady = true
    this.isLoading = false
    const { onReady, playing } = this.props
    onReady()
    if (playing) {
      this.player.play()
    }
    this.onDurationCheck()
  }
  onPlay = () => {
    this.isPlaying = true
    this.isLoading = false
    const { volume, muted, onStart, onPlay, playbackRate } = this.props
    if (this.startOnPlay) {
      if (this.player.setPlaybackRate) {
        this.player.setPlaybackRate(playbackRate)
      }
      onStart()
      this.startOnPlay = false
    }
    this.player.setVolume(muted ? 0 : volume)
    onPlay()
    if (this.seekOnPlay) {
      this.seekTo(this.seekOnPlay)
      this.seekOnPlay = null
    }
    this.onDurationCheck()
  }
  onPause = () => {
    this.isPlaying = false
    if (!this.isLoading) {
      this.props.onPause()
    }
  }
  onEnded = () => {
    const { activePlayer, loop, onEnded } = this.props
    if (activePlayer.loopOnEnded && loop) {
      this.seekTo(0)
    }
    if (!loop) {
      this.isPlaying = false
    }
    onEnded()
  }
  onDurationCheck = () => {
    clearTimeout(this.durationCheckTimeout)
    const duration = this.getDuration()
    if (duration) {
      if (!this.onDurationCalled) {
        this.props.onDuration(duration)
        this.onDurationCalled = true
      }
    } else {
      this.durationCheckTimeout = setTimeout(this.onDurationCheck, 100)
    }
  }
  ref = player => {
    if (player) {
      this.player = player
    }
  }
  render () {
    const Player = this.props.activePlayer
    return (
      <Player
        {...this.props}
        ref={this.ref}
        onReady={this.onReady}
        onPlay={this.onPlay}
        onPause={this.onPause}
        onEnded={this.onEnded}
      />
    )
  }
}
