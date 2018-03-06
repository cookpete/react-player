import React, { Component } from 'react'


//https://rutube.ru

export class RuTube extends Component {
  static displayName = 'SoundCloud'
  static canPlay = url => url.startsWith('https://rutube.ru')

  ref = iframe => {
    this.iframe = iframe;
    this.props.onReady();
  }

  load = () => {

  }

  play() {
    this.iframe.contentWindow.postMessage(JSON.stringify({
      type: 'player:play',
      data: {},
    }), '*');
    //this.callPlayer('play')
  }
  pause() {
    this.iframe.contentWindow.postMessage(JSON.stringify({
      type: 'player:pause',
      data: {}
    }), '*');
    //this.callPlayer('pause')
  }
  stop() {
    // Nothing to do
  }
  seekTo(seconds) {
    //this.callPlayer('seekTo', seconds * 1000)
  }
  setVolume(fraction) {
    // this.callPlayer('setVolume', fraction * 100)
  }
  getDuration() {
    //return this.duration
  }
  getCurrentTime() {
    // return this.currentTime
  }
  getSecondsLoaded() {
    return this.fractionLoaded * this.duration
  }

  render() {
    const result = this.props.url.split('/video/');
    const url = result[1].replace('/', '');
    const style = {
      width: '100%',
      height: '100%',
      ...this.props.style
    }

    return (
      <iframe
        ref={this.ref}
        src="https://rutube.ru/play/embed/86d910d5ee1b77bbf4fe40a7acf2d622/"
        // src={`https//rutube.ru/play/embed/${url}`}
        style={style}
        frameBorder={0}
      />
    )
  }
}