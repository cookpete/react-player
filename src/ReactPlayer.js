import React, { Component, Suspense } from 'react'
import merge from 'deepmerge'
import memoize from 'memoize-one'
import isEqual from 'react-fast-compare'

import { propTypes, defaultProps } from './props'
import { omit, lazy } from './utils'
import Player from './Player'

const Preview = lazy(() => import(/* webpackChunkName: 'reactPlayerPreview' */'./Preview'))
const SUPPORTED_PROPS = Object.keys(propTypes)
const customPlayers = []

export const createReactPlayer = (players, fallback) => {
  return class ReactPlayer extends Component {
    static displayName = 'ReactPlayer'
    static propTypes = propTypes
    static defaultProps = defaultProps
    static addCustomPlayer = player => { customPlayers.push(player) }
    static removeCustomPlayers = () => { customPlayers.length = 0 }

    static canPlay = url => {
      for (const Player of [...customPlayers, ...players]) {
        if (Player.canPlay(url)) {
          return true
        }
      }
      return false
    }

    static canEnablePIP = url => {
      for (const Player of [...customPlayers, ...players]) {
        if (Player.canEnablePIP && Player.canEnablePIP(url)) {
          return true
        }
      }
      return false
    }

    state = {
      showPreview: !!this.props.light
    }

    // Use references, as refs is used by React
    references = {
      wrapper: wrapper => { this.wrapper = wrapper },
      player: player => { this.player = player }
    }

    shouldComponentUpdate (nextProps, nextState) {
      return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState)
    }

    componentDidUpdate (prevProps) {
      const { light } = this.props
      if (!prevProps.light && light) {
        this.setState({ showPreview: true })
      }
      if (prevProps.light && !light) {
        this.setState({ showPreview: false })
      }
    }

    handleClickPreview = (e) => {
      this.setState({ showPreview: false })
      this.props.onClickPreview(e)
    }

    showPreview = () => {
      this.setState({ showPreview: true })
    }

    getDuration = () => {
      if (!this.player) return null
      return this.player.getDuration()
    }

    getCurrentTime = () => {
      if (!this.player) return null
      return this.player.getCurrentTime()
    }

    getSecondsLoaded = () => {
      if (!this.player) return null
      return this.player.getSecondsLoaded()
    }

    getInternalPlayer = (key = 'player') => {
      if (!this.player) return null
      return this.player.getInternalPlayer(key)
    }

    seekTo = (fraction, type, keepPlaying) => {
      if (!this.player) return null
      this.player.seekTo(fraction, type, keepPlaying)
    }

    handleReady = () => {
      this.props.onReady(this)
    }

    getActivePlayer = memoize(url => {
      for (const player of [...customPlayers, ...players]) {
        if (player.canPlay(url)) {
          return player
        }
      }
      if (fallback) {
        return fallback
      }
      return null
    })

    getConfig = memoize((url, key) => {
      const { config } = this.props
      return merge.all([
        defaultProps.config,
        defaultProps.config[key] || {},
        config,
        config[key] || {}
      ])
    })

    getAttributes = memoize(url => {
      return omit(this.props, SUPPORTED_PROPS)
    })

    renderPreview (url) {
      if (!url) return null
      const { light, playIcon, previewTabIndex, oEmbedUrl, previewAriaLabel } = this.props
      return (
        <Preview
          url={url}
          light={light}
          playIcon={playIcon}
          previewTabIndex={previewTabIndex}
          previewAriaLabel={previewAriaLabel}
          oEmbedUrl={oEmbedUrl}
          onClick={this.handleClickPreview}
        />
      )
    }

    renderActivePlayer = url => {
      if (!url) return null
      const player = this.getActivePlayer(url)
      if (!player) return null
      const config = this.getConfig(url, player.key)
      return (
        <Player
          {...this.props}
          key={player.key}
          ref={this.references.player}
          config={config}
          activePlayer={player.lazyPlayer || player}
          onReady={this.handleReady}
        />
      )
    }

    render () {
      const { url, style, width, height, fallback, wrapper: Wrapper } = this.props
      const { showPreview } = this.state
      const attributes = this.getAttributes(url)
      const wrapperRef = typeof Wrapper === 'string' ? this.references.wrapper : undefined

      // Many React frameworks like Next.js support Suspense on the server but there are
      // others like Fresh that don't plan to support it. Users can disable Suspense
      // by setting the fallback prop to false.
      const UniversalSuspense = fallback === false ? ({ children }) => children : Suspense

      return (
        <Wrapper ref={wrapperRef} style={{ ...style, width, height }} {...attributes}>
          <UniversalSuspense fallback={fallback}>
            {showPreview
              ? this.renderPreview(url)
              : this.renderActivePlayer(url)}
          </UniversalSuspense>
        </Wrapper>
      )
    }
  }
}
