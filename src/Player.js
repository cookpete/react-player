import React, { Component } from 'react'

import { propTypes, defaultProps } from './props'
import { isEqual } from './utils'

const SEEK_ON_PLAY_EXPIRY = 5000

export default class Player extends Component {
  static displayName = 'Player'
  static propTypes = propTypes
  static defaultProps = defaultProps
  mounted = false
  isReady = false
  isPlaying = false // Track playing state internally to prevent bugs
  isLoading = true // Use isLoading to prevent onPause when switching URL
  loadOnReady = null
  startOnPlay = true
  seekOnPlay = null
  onDurationCalled = false
  componentDidMount () {
    this.mounted = true
    this.player.load(this.props.url)
    this.progress()
  }
  componentWillUnmount () {
    clearTimeout(this.progressTimeout)
    clearTimeout(this.durationCheckTimeout)
    if (this.isReady) {
      this.player.stop()
    }
    if (this.player.disablePIP) {
      this.player.disablePIP()
    }
    this.mounted = false
  }
  componentDidUpdate(prevProps) {
    // Invoke player methods based on incoming props
    const { url, playing, volume, muted, playbackRate, pip, loop, activePlayer } = prevProps
    if (!isEqual(url, this.props.url)) {
      if (this.isLoading && !activePlayer.forceLoad) {
        console.warn(`ReactPlayer: the attempt to load ${this.props.url} is being deferred until the player has loaded`)
        this.loadOnReady = this.props.url
        return
      }
      this.isLoading = true
      this.startOnPlay = true
      this.onDurationCalled = false
      this.player.load(this.props.url, this.isReady)
    }
    if (!playing && this.props.playing && !this.isPlaying) {
      this.player.play()
    }
    if (playing && !this.props.playing && this.isPlaying) {
      this.player.pause()
    }
    if (!pip && this.props.pip && this.player.enablePIP) {
      this.player.enablePIP()
    } else if (pip && !this.props.pip && this.player.disablePIP) {
      this.player.disablePIP()
    }
    if (volume !== this.props.volume && this.props.volume !== null) {
      this.player.setVolume(this.props.volume)
    }
    if (muted !== this.props.muted) {
      if (this.props.muted) {
        this.player.mute()
      } else {
        this.player.unmute()
        if (this.props.volume !== null) {
          // Set volume next tick to fix a bug with DailyMotion
          setTimeout(() => this.player.setVolume(this.props.volume))
        }
      }
    }
    if (playbackRate !== this.props.playbackRate && this.player.setPlaybackRate) {
      this.player.setPlaybackRate(this.props.playbackRate)
    }
    if (loop !== this.props.loop && this.player.setLoop) {
      this.player.setLoop(this.props.loop)
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
        // Only call onProgress if values have changed
        if (progress.playedSeconds !== this.prevPlayed || progress.loadedSeconds !== this.prevLoaded) {
          this.props.onProgress(progress)
        }
        this.prevPlayed = progress.playedSeconds
        this.prevLoaded = progress.loadedSeconds
      }
    }
    this.progressTimeout = setTimeout(this.progress, this.props.progressFrequency || this.props.progressInterval)
  }
  seekTo (amount, type) {
    // When seeking before player is ready, store value and seek later
    if (!this.isReady && amount !== 0) {
      this.seekOnPlay = amount
      setTimeout(() => { this.seekOnPlay = null }, SEEK_ON_PLAY_EXPIRY)
      return
    }
    const isFraction = !type ? (amount > 0 && amount < 1) : type === 'fraction'
    if (isFraction) {
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
    const { onReady, playing, volume, muted } = this.props
    onReady()
    if (!muted && volume !== null) {
      this.player.setVolume(volume)
    }
    if (this.loadOnReady) {
      this.player.load(this.loadOnReady, true)
      this.loadOnReady = null
    } else if (playing) {
      this.player.play()
    }
    this.onDurationCheck()
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
      onEnded()
    }
  }
  onError = (...args) => {
    this.isLoading = false
    this.props.onError(...args)
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
  onLoaded = () => {
    // Sometimes we know loading has stopped but onReady/onPlay are never called
    // so this provides a way for players to avoid getting stuck
    this.isLoading = false
  }
  ref = player => {
    if (player) {
      this.player = player
    }
  }
  render () {
    const Player = this.props.activePlayer
    if (!Player) {
      return null
    }
    return (
      <Player
        {...this.props}
        ref={this.ref}
        onReady={this.onReady}
        onPlay={this.onPlay}
        onPause={this.onPause}
        onEnded={this.onEnded}
        onLoaded={this.onLoaded}
        onError={this.onError}
      />
    )
  }
}
