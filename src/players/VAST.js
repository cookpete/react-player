import React, { Component } from 'react'
import { callPlayer, randomString } from '../utils'
import createSinglePlayer from '../singlePlayer'
import { loadImaSdk } from '@alugha/ima'

const IOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
const PLAYER_ID_PREFIX = 'vast-player-'
const AUTOPLAY_ID_PREFIX = 'vast-autoplay-'
const CONTENT_ID_PREFIX = 'vast-content-'
const PLAY_BUTTON_ID_PREFIX = 'vast-play-'
const MATCH_URL = /^VAST:https:\/\//i

// Example: https://github.com/googleads/googleads-ima-html5/blob/master/attempt_to_autoplay/ads.js
export class VAST extends Component {
  static displayName = 'VAST';
  static canPlay = url => MATCH_URL.test(url);

  state = {
    adDisplayContainer: null,
    autoplayChecksResolved: false,
    adObject: null,
    adsInitialized: false,
    adsLoader: null,
    adsManager: null,
    adsRequest: null,
    adsUrl: null,
    autoplayAllowed: null,
    autoplayRequiresMuted: null,
    ima: null,
    preMuteVolume: 0,
    showPlayButton: false
  }

  autoplayID = AUTOPLAY_ID_PREFIX + randomString()
  playerID = PLAYER_ID_PREFIX + randomString()
  contentID = CONTENT_ID_PREFIX + randomString()
  playButtonID = PLAY_BUTTON_ID_PREFIX + randomString()
  callPlayer = callPlayer;

  onAutoplayWithSoundSuccess () {
    // If we make it here, unmuted autoplay works.
    this.autoplayTestPlayer.pause()
    this.setState({
      autoplayAllowed: true,
      autoplayRequiresMuted: false,
      autoplayChecksResolved: true
    })
  }

  onMutedAutoplaySuccess () {
    // If we make it here, muted autoplay works but unmuted autoplay does not.
    this.autoplayTestPlayer.pause()
    this.setState({
      autoplayAllowed: true,
      autoplayRequiresMuted: true,
      autoplayChecksResolved: true
    })
  }

  onMutedAutoplayFail () {
    // Both muted and unmuted autoplay failed. Fall back to click to play.
    this.autoplayTestPlayer.volume = 1
    this.autoplayTestPlayer.muted = false
    this.setState({
      autoplayAllowed: false,
      autoplayRequiresMuted: false,
      autoplayChecksResolved: true
    })
  }

  checkMutedAutoplaySupport () {
    this.autoplayTestPlayer.volume = 0
    this.autoplayTestPlayer.muted = true
    const promise = this.autoplayTestPlayer.play()
    if (promise !== undefined) {
      promise.then(() => {
        this.onMutedAutoplaySuccess()
      }).catch(() => {
        this.onMutedAutoplayFail()
      })
    }
  }

  checkAutoplaySupport () {
    const promise = this.autoplayTestPlayer.play()
    if (promise !== undefined) {
      promise
        .then(() => {
          this.onAutoplayWithSoundSuccess()
        })
        .catch(() => {
          this.checkMutedAutoplaySupport()
        })
    }
  }

  addListeners () {
    const { playsinline } = this.props
    if (playsinline) {
      this.player.setAttribute('playsinline', '')
      this.player.setAttribute('webkit-playsinline', '')
      this.player.setAttribute('x5-playsinline', '')
    }
  }

  componentDidMount () {
    this.addListeners()
    if (IOS) {
      this.player.load()
    }
  }

  componentDidUpdate (prevProps, prevState) {
    // sdk is loaded
    if (prevState.adsUrl === null && this.state.adsUrl) {
      return this.checkAutoplaySupport()
    }

    // autoplay settings determined
    if (
      prevState.autoplayChecksResolved === false &&
      this.state.autoplayChecksResolved === true
    ) {
      return this.onAutoplayChecksResolved()
    }

    // adsManager events listening
    if (prevState.adsManager === null && this.state.adsManager) {
      this.onReady()
    }
  }

  componentWillUnmount () {
    this.removeListeners()
  }

  removeListeners () {
    const { adsManager } = this.state
    window.removeEventListener('resize', this._onWindowResize)

    if (adsManager && this.eventMap) {
      for (const [event, fn] of Object.entries(this.eventMap)) {
        adsManager.removeEventListener(event, fn)
      }
    }
  }

  onWindowResize () {
    const { adsManager, ima } = this.state
    const {offsetHeight: height, offsetWidth: width} = this.player
    if (!adsManager) return null
    adsManager.resize(width, height, ima.ViewMode.NORMAL)
  }

  onLoaded (adEvent) {
    const { onPlay } = this.props
    const adObject = adEvent.getAd()
    onPlay()
    this.setState({adObject})
  }

  onVolumeChange () {
    const { onVolumeChange } = this.props
    const { adsManager } = this.state
    return onVolumeChange(adsManager.getVolume())
  }

  onAdsManagerLoaded (adsManagerLoadedEvent) {
    const {
      onEnded,
      onPause,
      onPlay
    } = this.props
    const { ima } = this.state
    const adsManager = adsManagerLoadedEvent.getAdsManager(this.player)

    // bind resize event
    this._onWindowResize = this.onWindowResize.bind(this)
    window.addEventListener('resize', this._onWindowResize)

    this.eventMap = {
      [ima.AdErrorEvent.Type.AD_ERROR]: this.onError.bind(this),
      [ima.AdEvent.Type.COMPLETE]: onEnded.bind(this),
      [ima.AdEvent.Type.LOADED]: this.onLoaded.bind(this),
      [ima.AdEvent.Type.RESUMED]: onPlay.bind(this),
      [ima.AdEvent.Type.PAUSED]: onPause.bind(this),
      [ima.AdEvent.Type.VOLUME_CHANGED]: this.onVolumeChange.bind(this)
    }

    for (const [event, fn] of Object.entries(this.eventMap)) {
      adsManager.addEventListener(event, fn)
    }

    this.setState({adsManager})
  }

  onAutoplayChecksResolved () {
    const { adsUrl, adsLoader, autoplayAllowed, autoplayRequiresMuted, ima } = this.state
    // setup ads request
    const adsRequest = new ima.AdsRequest()
    adsRequest.adTagUrl = adsUrl
    adsRequest.setAdWillAutoPlay(autoplayAllowed)
    adsRequest.setAdWillPlayMuted(autoplayRequiresMuted)
    adsLoader.requestAds(adsRequest)
  }

  onReady () {
    const { playing, onReady } = this.props
    const { autoplayAllowed, autoplayRequiresMuted } = this.state
    if (autoplayAllowed && playing) {
      if (autoplayRequiresMuted) {
        this.setVolume(0.0)
      }
      this.playAds()
    } else {
      this.setState({showPlayButton: true})
    }
    onReady()
  }

  playAds () {
    const { adDisplayContainer, adsManager, adsInitialized, ima } = this.state
    try {
      if (!adsInitialized) {
        adDisplayContainer.initialize()
        this.setState({adsInitialized: true})
      }
      // Initialize the ads manager. Ad rules playlist will start at this time.
      adsManager.init(640, 360, ima.ViewMode.NORMAL)

      // trigger window resize
      this.onWindowResize()

      // Call play to start showing the ad. Single video and overlay ads will
      // start at this time; the call will be ignored for ad rules.
      adsManager.start()
    } catch (adError) {
      // An error may be thrown if there was a problem with the VAST response.
      this.props.onEnded()
    }
  }

  load (rawUrl) {
    // replace [RANDOM] or [random] with a randomly generated cache value
    const ord = Math.random() * 10000000000000000
    const url = rawUrl.replace(/\[random]/ig, ord)

    loadImaSdk().then(ima => {
      // Create the ad display container.
      const adDisplayContainer = new ima.AdDisplayContainer(this.container, this.player)

      // Create the ads loader.
      const adsLoader = new ima.AdsLoader(adDisplayContainer)

      // Listen and respond to ads loaded and error events
      adsLoader.addEventListener(
        ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
        this.onAdsManagerLoaded.bind(this),
        false)
      adsLoader.addEventListener(
        ima.AdErrorEvent.Type.AD_ERROR,
        this.onError.bind(this),
        false)

      this.setState({
        ima,
        adDisplayContainer,
        adsLoader,
        adsUrl: url.slice('VAST:'.length)
      })
    }).catch(() => {
      // error loading ima, probably because of adblock. just fire onended
      this.props.onEnded()
    })
  }

  onError (error) {
    const { onError } = this.props
    const { adsManager } = this.state
    if (adsManager) {
      adsManager.destroy()
    }
    onError(error)
  }

  pause () {
    const {adsManager} = this.state
    adsManager.pause()
  }

  seekTo () {}

  stop () {
    const {adsManager} = this.state
    if (!adsManager) return null
    adsManager.destroy()
  }

  setVolume (fraction) {
    const {adsManager} = this.state
    if (!adsManager) return null
    adsManager.setVolume(fraction)
  }

  mute = () => {
    const {adsManager} = this.state
    if (!adsManager) return null
    this.setState({preMuteVolume: adsManager.getVolume()})
    this.setVolume(0.0)
  };

  unmute = () => {
    const {preMuteVolume} = this.state
    this.setVolume(preMuteVolume)
  };

  getDuration () {
    const { adObject } = this.state
    if (!adObject) return null
    const duration = adObject.getDuration()
    return duration > 0 ? duration : null
  }

  getCurrentTime () {
    const {adsManager} = this.state
    if (!adsManager) return null
    const duration = this.getDuration()
    const remainingTime = adsManager.getRemainingTime()
    if (Number.isFinite(duration) && Number.isFinite(remainingTime)) {
      return duration - remainingTime
    }
    return null
  }

  getSecondsLoaded () {
    return null
  }

  containerRef = (container) => {
    this.container = container
  }

  playerRef = (player) => {
    this.player = player
  };

  autoplayRef = (player) => {
    this.autoplayTestPlayer = player
  };

  play (event) {
    // Initialize the container. Must be done via a user action where autoplay
    // is not allowed.
    const {
      adDisplayContainer,
      adsInitialized,
      adsManager,
      autoplayRequiresMuted,
      autoplayAllowed
    } = this.state
    if (!adsManager) return null
    if (adsInitialized) {
      adsManager.resume()
    } else {
      // non-user event, and autoplay not allowed
      if (!event && !autoplayAllowed) return null

      adDisplayContainer.initialize()
      this.setState({
        adsInitialized: true,
        showPlayButton: false
      })
      this.player.load()

      // must mute if autoplay requires am ute
      if (!event && autoplayRequiresMuted) {
        this.setVolume(0.0)
      }
      this.playAds()
    }
  }

  // used to determine autoplay
  renderTestPlayer () {
    return (
      <video
        ref={this.autoplayRef}
        controls={false}
        style={{display: 'none'}}
        id={this.autoplayID}
      >
        <source src={'https://s0.2mdn.net/4253510/google_ddm_animation_480P.mp4'} />
        <source src={'https://s0.2mdn.net/4253510/google_ddm_animation_480P.webm'} />
      </video>
    )
  }

  render () {
    const { width, height } = this.props
    const { autoplayChecksResolved, showPlayButton } = this.state
    const dimensions = {
      width: width === 'auto' ? width : '100%',
      height: height === 'auto' ? height : '100%'
    }
    const contentStyle = {
      ...dimensions,
      top: 0,
      left: 0,
      position: 'absolute',
      zIndex: 1
    }
    const playButtonStyle = {
      borderStyle: 'solid',
      borderWidth: '16px 0 16px 26px',
      borderColor: 'transparent transparent transparent white',
      cursor: 'pointer',
      left: '50%',
      marginLeft: '-8px',
      marginTop: '-8px',
      position: 'absolute',
      top: '50%',
      zIndex: 2
    }
    return (
      <div style={{...dimensions, position: 'relative'}}>
        { showPlayButton &&
          <div style={playButtonStyle} id={this.playButtonID} onClick={(e) => this.play(e)} /> }
        <video
          ref={this.playerRef}
          controls={false}
          style={dimensions}
          id={this.playerID}
        />
        { !autoplayChecksResolved && this.renderTestPlayer()}
        <div id={this.contentID} style={contentStyle} ref={this.containerRef} />
      </div>
    )
  }
}

export default createSinglePlayer(VAST)
