import React, { Component } from 'react'

import { propTypes, defaultProps } from './props'
import Player from './Player'
import { isEqual, getConfig } from './utils'

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
    render () {
      if (!activePlayer.canPlay(this.props.url)) {
        return null
      }
      return (
        <Player
          {...this.props}
          activePlayer={activePlayer}
          config={getConfig(this.props, defaultProps)}
        />
      )
    }
  }
}
