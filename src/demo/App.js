import React, { Component } from 'react'

import './Range.scss'
import ReactPlayer from '../ReactPlayer'

export default class App extends Component {
  state = {
    url: null,
    playing: false,
    volume: 0.8,
    played: 0,
    loaded: 0
  }
  load = url => {
    this.setState({ url, playing: true })
  }
  playPause = () => {
    this.setState({ playing: !this.state.playing })
  }
  stop = () => {
    this.setState({ url: null, playing: false })
  }
  setVolume = e => {
    this.setState({ volume: parseFloat(e.target.value) })
  }
  onSeekMouseDown = e => {
    this.setState({ seeking: true })
  }
  onSeekChange = e => {
    this.setState({ played: parseFloat(e.target.value) })
  }
  onSeekMouseUp = e => {
    this.setState({ seeking: false })
    this.refs.player.seekTo(parseFloat(e.target.value))
  }
  onProgress = state => {
    // We only want to update time slider if we are not currently seeking
    if (!this.state.seeking) {
      this.setState(state)
    }
  }
  onConfigSubmit = () => {
    let config
    try {
      config = JSON.parse(this.refs.config.value)
    } catch (error) {
      config = {}
      console.error('Error setting config:', error)
    }
    this.setState(config)
  }
  render () {
    return (
      <div>
        <h1>rmp</h1>
        <ReactPlayer
          ref='player'
          url={this.state.url}
          playing={this.state.playing}
          volume={this.state.volume}
          onProgress={this.onProgress}
          soundcloudConfig={this.state.soundcloudConfig}
          vimeoConfig={this.state.vimeoConfig}
          youtubeConfig={this.state.youtubeConfig}
          onPlay={() => console.log('onPlay')}
          onPause={() => console.log('onPause')}
          onBuffer={() => console.log('onBuffer')}
          onEnded={() => console.log('onEnded')}
        />
        <button onClick={this.stop}>Stop</button>
        <button onClick={this.playPause}>{this.state.playing ? 'Pause' : 'Play'}</button>
        <button onClick={this.load.bind(this, 'https://www.youtube.com/watch?v=oUFJJNQGwhk')}>Youtube video</button>
        <button onClick={this.load.bind(this, 'https://soundcloud.com/miami-nights-1984/accelerated')}>Soundcloud song</button>
        <button onClick={this.load.bind(this, 'https://vimeo.com/90509568')}>Vimeo video</button>
        <button onClick={this.load.bind(this, 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4')}>MP4 video</button>
        <button onClick={this.load.bind(this, 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.ogv')}>OGV video</button>
        <button onClick={this.load.bind(this, 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.webm')}>WEBM video</button>
        <input ref='url' placeholder='url' />
        <button onClick={() => { this.load(this.refs.url.value) }}>Load URL</button>
        <hr />
        seek: <input
          type='range' min={0} max={1} step='any'
          value={this.state.played}
          onMouseDown={this.onSeekMouseDown}
          onChange={this.onSeekChange}
          onMouseUp={this.onSeekMouseUp}
        />
        played: <progress max={1} value={this.state.played} />
        loaded: <progress max={1} value={this.state.loaded} />
        volume: <input
          type='range' min={0} max={1} step='any'
          value={this.state.volume}
          onChange={this.setVolume}
        />
        <hr />
        <textarea ref='config' placeholder='Config JSON' style={{width: '200px', height: '200px'}}></textarea>
        <button onClick={this.onConfigSubmit}>Update Config</button>
      </div>
    )
  }
}
