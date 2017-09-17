import { Component } from 'react'

import { propTypes, defaultProps } from './props'

const SEEK_ON_PLAY_EXPIRY = 5000

export default function createPlayer (options) {
  return class Player extends Component {
    static propTypes = propTypes
    static defaultProps = defaultProps
    static displayName = options.displayName
    static canPlay (url) {
      if (options.canPlay) {
        return options.canPlay(url)
      }
      return options.matchURL.test(url)
    }
    isReady = false
    startOnPlay = true
    seekOnPlay = null
    componentDidMount () {
      const { url } = this.props
      this.mounted = true
      if (url) {
        this.load(url)
      } else if (this.callMethod('shouldPreload', this.props)) {
        this.callMethod('load', options.preloadURL)
        this.preloading = true
      }
    }
    componentWillUnmount () {
      this.callMethod('stop')
      this.mounted = false
    }
    componentWillReceiveProps (nextProps) {
      const { url, playing, volume, muted, playbackRate } = this.props
      // Invoke player methods based on incoming props
      if (url !== nextProps.url && nextProps.url) {
        this.seekOnPlay = null
        this.startOnPlay = true
        this.load(nextProps.url, nextProps)
      }
      if (url && !nextProps.url) {
        this.callMethod('stop')
        clearTimeout(this.updateTimeout)
      }
      if (!playing && nextProps.playing) {
        this.callMethod('play')
      }
      if (playing && !nextProps.playing) {
        this.callMethod('pause')
      }
      if (volume !== nextProps.volume && !nextProps.muted) {
        this.callMethod('setVolume', nextProps.volume)
      }
      if (muted !== nextProps.muted) {
        this.callMethod('setVolume', nextProps.muted ? 0 : nextProps.volume)
      }
      if (playbackRate !== nextProps.playbackRate && options.setPlaybackRate) {
        this.callMethod('setPlaybackRate', nextProps.playbackRate)
      }
    }
    shouldComponentUpdate (nextProps) {
      return this.props.url !== nextProps.url
    }
    load (url, props = this.props) {
      const callbacks = {
        onReady: this.onReady,
        onPlay: this.onPlay,
        onEnded: this.onEnded,
        onPause: this.props.onPause,
        onSeek: this.props.onSeek,
        onBuffer: this.props.onBuffer,
        onError: this.props.onError
      }
      options.load(url, callbacks, props, this.element, this.isReady, this.player).then(player => {
        this.player = player
      })
    }
    callMethod (method, ...args) {
      if (!options[method]) {
        return null
      }
      if (method === 'stop' && this.preloading) {
        return null
      }
      if (typeof options[method] === 'string') {
        return this.callPlayer(options[method], ...args)
      }
      if (typeof options[method] === 'function') {
        return options[method](this.player, ...args)
      }
    }
    callPlayer (method, ...args) {
      // Util method for calling a method on this.player
      // but guard against errors and console.warn instead
      if (!this.isReady || !this.player || !this.player[method]) {
        let message = `ReactPlayer: ${this.constructor.displayName} player could not call %c${method}%c – `
        if (!this.isReady) {
          message += 'The player was not ready'
        } else if (!this.player) {
          message += 'The player was not available'
        } else if (!this.player[method]) {
          message += 'The method was not available'
        }
        console.warn(message, 'font-weight: bold', '')
        return null
      }
      return this.player[method](...args)
    }
    getCurrentTime () {
      return this.callMethod('getCurrentTime')
    }
    getSecondsLoaded () {
      return this.callMethod('getSecondsLoaded')
    }
    getDuration () {
      return this.callMethod('getDuration')
    }
    seekTo (amount) {
      // When seeking before player is ready, store value and seek later
      if (!this.isReady && amount !== 0) {
        this.seekOnPlay = amount
        setTimeout(() => {
          this.seekOnPlay = null
        }, SEEK_ON_PLAY_EXPIRY)
      }
      if (amount > 0 && amount < 1) {
        // Convert fraction to seconds based on duration
        const duration = this.callMethod('getDuration')
        if (!duration) {
          console.warn('ReactPlayer: could not seek using fraction – duration not yet available')
          return
        }
        this.callMethod('seekTo', duration * amount)
        return
      }
      this.callMethod('seekTo', amount)
    }
    onPlay = () => {
      const { volume, muted, onStart, onPlay, playbackRate } = this.props
      if (this.startOnPlay) {
        if (options.setPlaybackRate) {
          this.callMethod('setPlaybackRate', playbackRate)
        }
        this.callMethod('setVolume', muted ? 0 : volume)
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
    onReady = () => {
      const { onReady, playing } = this.props
      this.isReady = true
      this.loadingSDK = false
      onReady()
      if (playing || this.preloading) {
        this.preloading = false
        if (this.loadOnReady) {
          this.load(this.loadOnReady)
          this.loadOnReady = null
        } else {
          this.callMethod('play')
        }
      }
      this.onDurationCheck()
    }
    onEnded = () => {
      const { loop, onEnded } = this.props
      if (options.loopOnEnded && loop) {
        this.seekTo(0)
      }
      onEnded()
    }
    onDurationCheck = () => {
      clearTimeout(this.durationCheckTimeout)
      const duration = this.callMethod('getDuration')
      if (duration) {
        this.props.onDuration(duration)
      } else {
        this.durationCheckTimeout = setTimeout(this.onDurationCheck, 100)
      }
    }
    ref = element => {
      this.element = element
    }
    render () {
      return options.render(this.props, this.ref)
    }
  }
}
