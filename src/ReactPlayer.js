import React, { Component, Suspense, lazy } from 'react'
import merge from 'deepmerge'
import memoize from 'memoize-one'
import isEqual from 'react-fast-compare'

import { propTypes, defaultProps } from './props'
import { omit } from './utils'
import Player from './Player'

const Preview = lazy(() => import(/* webpackChunkName: 'reactPlayerPreview' */'./Preview'))

const IS_BROWSER = typeof window !== 'undefined' && window.document
const IS_GLOBAL = typeof global !== 'undefined' && global.window && global.window.document
const SUPPORTED_PROPS = Object.keys(propTypes)

// Return null when rendering on the server
// as Suspense is not supported yet
const UniversalSuspense = IS_BROWSER || IS_GLOBAL ? Suspense : () => null

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

    seekTo = (fraction, type) => {
      if (!this.player) return null
      this.player.seekTo(fraction, type)
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
      const { light, playIcon, previewTabIndex } = this.props
      return (
        <Preview
          url={url}
          light={light}
          playIcon={playIcon}
          previewTabIndex={previewTabIndex}
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
      return (
        <Wrapper ref={this.references.wrapper} style={{ ...style, width, height }} {...attributes}>
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
