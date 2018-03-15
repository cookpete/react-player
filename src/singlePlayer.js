import React, { Component } from 'react'

import { propTypes, defaultProps, DEPRECATED_CONFIG_PROPS } from './props'
import { getConfig, omit, isEqual } from './utils'
import Player from './Player'

const SUPPORTED_PROPS = Object.keys(propTypes)

export default function createSinglePlayer (activePlayer) {
  return class SinglePlayer extends Component {
    static displayName = `${activePlayer.displayName}Player`
    static propTypes = propTypes
    static defaultProps = defaultProps
    static canPlay = activePlayer.canPlay

    shouldComponentUpdate (nextProps) {
      return !isEqual(this.props, nextProps)
    }
    componentWillUpdate (nextProps) {
      this.config = getConfig(nextProps, defaultProps)
    }
    ref = player => {
      this.player = player
    }
    render () {
      if (!activePlayer.canPlay(this.props.url)) {
        return null
      }
      const { style, width, height, wrapper: Wrapper } = this.props
      const otherProps = omit(this.props, SUPPORTED_PROPS, DEPRECATED_CONFIG_PROPS)
      return (
        <Wrapper style={{ ...style, width, height }} {...otherProps}>
          <Player
            {...this.props}
            ref={this.ref}
            activePlayer={activePlayer}
            config={getConfig(this.props, defaultProps)}
          />
        </Wrapper>
      )
    }
  }
}
