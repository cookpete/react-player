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
  nextUrl = null // Used to prevent double loading
  onDurationCalled = false
  componentDidMount () {
    this.mounted = true
    this.player.load(this.props.url)
    this.progress()
  }
  componentWillUnmount () {
    clearTimeout(this.progressTimeout)
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
      this.startOnPlay = true
      this.onDurationCalled = false

      // don't double load SDK
      if (!this.isReady) {
        this.nextUrl = nextProps.url
      } else {
        this.player.load(nextProps.url, true)
      }
    }
    if (!playing && nextProps.playing && !this.isPlaying) {
      this.player.play()
    }
    if (playing && !nextProps.playing && this.isPlaying) {
      this.player.pause()
    }
    if (nextProps.volume !== null) {
      if (volume !== nextProps.volume && !nextProps.muted) {
        this.player.setVolume(nextProps.volume)
      }
      if (muted !== nextProps.muted) {
        this.player.setVolume(nextProps.muted ? 0 : nextProps.volume)
      }
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
  progress = () => {
    if (this.props.url && this.player && this.isReady) {
      const playedSeconds = this.getCurrentTime() || 0
      const loadedSeconds = this.getSecondsLoaded()
      const duration = this.getDuration()
      if (duration) {
        const progress = {
          playedSeconds,
          played: playedSeconds / duration
        }
        if (loadedSeconds !== null) {
          progress.loadedSeconds = loadedSeconds
          progress.loaded = loadedSeconds / duration
        }

        // Special case for live types so they still OnProgress
        if (duration === Infinity && progress.playedSeconds !== this.prevPlayedSeconds) {
          this.props.onProgress(progress)
        } else if (progress.played !== this.prevPlayed || progress.loaded !== this.prevLoaded) {
          this.props.onProgress(progress)
        }
        this.prevPlayedSeconds = progress.playedSeconds
        this.prevPlayed = progress.played
        this.prevLoaded = progress.loaded
      }
    }
    this.progressTimeout = setTimeout(this.progress, this.props.progressFrequency || this.props.progressInterval)
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
    const { onReady, playing, volume, muted } = this.props
    onReady()

    if (muted || volume !== null) {
      this.player.setVolume(muted ? 0 : volume)
    }
    if (playing) {
      this.player.play()
    }
    this.onDurationCheck()

    // url was attempting to play while sdk was loading.. load proper one
    if (this.nextUrl) {
      this.player.load(this.nextUrl, true)
      this.nextUrl = null
    }
  }
  onPlay = () => {
    this.isPlaying = true
    this.isLoading = false
    const { onStart, onPlay, playbackRate } = this.props
    if (this.startOnPlay) {
      if (this.player.setPlaybackRate) {
        this.player.setPlaybackRate(playbackRate)
      }
      onStart()
      this.startOnPlay = false
    }
    onPlay()
    if (this.seekOnPlay) {
      this.seekTo(this.seekOnPlay)
      this.seekOnPlay = null
    }
    this.onDurationCheck()
  }
  onPause = (e) => {
    this.isPlaying = false
    if (!this.isLoading) {
      this.props.onPause(e)
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
