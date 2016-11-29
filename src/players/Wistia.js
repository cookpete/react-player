import React from 'react'
import loadScript from 'load-script'

import Base from './Base'

const SDK_URL = '//fast.wistia.com/assets/external/E-v1.js'
const MATCH_URL = /^https?:\/\/(.+)?(wistia.com|wi.st)\/(medias|embed)\/(.*)$/

export default class Wistia extends Base {
  static displayName = 'Wistia'
  static canPlay (url) {
    return MATCH_URL.test(url)
  }
  constructor(props) {
    super(props)
    this.state = {
      id: null
    }
    this.loadingSDK = true;
    this.getSDK().then(() => {
      this.loadingSDK = false;
    })
  }
  shouldComponentUpdate (nextProps, nextState) {
    return (
      super.shouldComponentUpdate(nextProps, nextState) ||
      this.state.id !== nextState.id
    )
  }
  getSDK () {
    return new Promise((resolve, reject) => {
      loadScript(SDK_URL, err => {
        if (err) reject(err)
      })
    })
  }
  load (url) {
    const id = url && url.match(MATCH_URL)[4]
    this.setState({
      id: id
    })
  }
  stop () {

  }
  getFractionLoaded () {
    0
  }
  getFractionPlayed () {
    0
  }
  ref = player => {
    this.player = player
  }

  render () {
    const style = {
      width: '100%',
      height: '100%',
      display: this.props.url ? 'block' : 'none'
    }
    return (
      <div ref={this.ref} className={`wistia_embed wistia_async_${this.state.id}`} style={style} />
    )
  }
}
