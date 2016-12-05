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
    this.loadingSDK = true
    this.video = null
  }
  componentDidMount() {
    this.getSDK().then((_script) => {
      this.loadingSDK = false
      window._wq = window._wq || []
      _wq.push({ id: this.getVideoId(this.props.url), onReady: (video) => {
        this.props.onReady();
        console.log("Got a handle of: ", video._hashedId)
        this.video = video
        if (this.props.playing) this.video.play()

      }})
    })
  }
  getSDK () {
    return new Promise((resolve, reject) => {
      loadScript(SDK_URL, (err, script) => {
        if (err) reject(err)
        resolve(script)
      })
    })
  }
  load (url) {
    console.log(`Loading video id: ${this.getVideoId(this.props.url)}`)
    _wq.push({ id: this.getVideoId(url), onReady: (video) => {
      this.props.onReady()
      this.video = video
      this.video.play()
    }})
  }
  stop () {
    if (this.video) {
      this.video.pause()
    }
  }
  pause () {
    this.video && this.video.pause()
  }
  play () {
    this.video.play()
  }
  getFractionLoaded () {
    0
  }
  getFractionPlayed () {
    0
  }
  getVideoId(url) {
    return url && url.match(MATCH_URL)[4]
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

    const id = this.getVideoId(this.props.url)
    console.log(`Rendering ${id}`)
    return (
      <div ref={this.ref} className={`wistia_embed wistia_async_${id}`} style={style} />
    )
  }
}
