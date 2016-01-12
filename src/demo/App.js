import React, { Component } from 'react'

import 'normalize.css/normalize.css'
import './defaults.scss'
import './App.scss'
import './Range.scss'

import ReactPlayer from '../ReactPlayer'

export default class App extends Component {
  state = {
    url: null,
    playing: true,
    volume: 0.8,
    played: 0,
    loaded: 0
  };
  load = url => {
    this.setState({
      url,
      played: 0,
      loaded: 0
    })
  };
  playPause = () => {
    this.setState({ playing: !this.state.playing })
  };
  stop = () => {
    this.setState({ url: null, playing: false })
  };
  setVolume = e => {
    this.setState({ volume: parseFloat(e.target.value) })
  };
  onSeekMouseDown = e => {
    this.setState({ seeking: true })
  };
  onSeekChange = e => {
    this.setState({ played: parseFloat(e.target.value) })
  };
  onSeekMouseUp = e => {
    this.setState({ seeking: false })
    this.refs.player.seekTo(parseFloat(e.target.value))
  };
  onProgress = state => {
    // We only want to update time slider if we are not currently seeking
    if (!this.state.seeking) {
      this.setState(state)
    }
  };
  onConfigSubmit = () => {
    let config
    try {
      config = JSON.parse(this.refs.config.value)
    } catch (error) {
      config = {}
      console.error('Error setting config:', error)
    }
    this.setState(config)
  };
  renderLoadButton = (url, label) => {
    return (
      <button onClick={() => this.load(url)}>
        { label }
      </button>
    )
  };
  render () {
    return (
      <div className='app'>
        <section className='section'>
          <h1>ReactPlayer Demo</h1>
          <ReactPlayer
            ref='player'
            className='react-player'
            width={480}
            height={270}
            url={this.state.url}
            playing={this.state.playing}
            volume={this.state.volume}
            soundcloudConfig={this.state.soundcloudConfig}
            vimeoConfig={this.state.vimeoConfig}
            youtubeConfig={this.state.youtubeConfig}
            onPlay={() => this.setState({ playing: true })}
            onPause={() => this.setState({ playing: false })}
            onBuffer={() => console.log('onBuffer')}
            onEnded={() => this.setState({ playing: false })}
            onProgress={this.onProgress}
          />

          <table><tbody>
            <tr>
              <th>Controls</th>
              <td>
                <button onClick={this.stop}>Stop</button>
                <button onClick={this.playPause}>{this.state.playing ? 'Pause' : 'Play'}</button>
              </td>
            </tr>
            <tr>
              <th>Seek</th>
              <td>
                <input
                  type='range' min={0} max={1} step='any'
                  value={this.state.played}
                  onMouseDown={this.onSeekMouseDown}
                  onChange={this.onSeekChange}
                  onMouseUp={this.onSeekMouseUp}
                />
              </td>
            </tr>
            <tr>
              <th>Volume</th>
              <td>
                <input type='range' min={0} max={1} step='any' value={this.state.volume} onChange={this.setVolume} />
              </td>
            </tr>
            <tr>
              <th>Played</th>
              <td><progress max={1} value={this.state.played} /></td>
            </tr>
            <tr>
              <th>Loaded</th>
              <td><progress max={1} value={this.state.loaded} /></td>
            </tr>
          </tbody></table>
        </section>
        <section className='section'>
          <table><tbody>
            <tr>
              <th>YouTube</th>
              <td>
                { this.renderLoadButton('https://www.youtube.com/watch?v=oUFJJNQGwhk', 'Test A') }
                { this.renderLoadButton('https://www.youtube.com/watch?v=jNgP6d9HraI', 'Test B') }
              </td>
            </tr>
            <tr>
              <th>SoundCloud</th>
              <td>
                { this.renderLoadButton('https://soundcloud.com/miami-nights-1984/accelerated', 'Test A') }
                { this.renderLoadButton('https://soundcloud.com/bonobo/flashlight', 'Test B') }
              </td>
            </tr>
            <tr>
              <th>Vimeo</th>
              <td>
                { this.renderLoadButton('https://vimeo.com/90509568', 'Test A') }
                { this.renderLoadButton('https://vimeo.com/94502406', 'Test B') }
              </td>
            </tr>
            <tr>
              <th>Files</th>
              <td>
                { this.renderLoadButton('http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4', 'MP4') }
                { this.renderLoadButton('http://clips.vorwaerts-gmbh.de/big_buck_bunny.ogv', 'OGV') }
                { this.renderLoadButton('http://clips.vorwaerts-gmbh.de/big_buck_bunny.webm', 'WEBM') }
              </td>
            </tr>
            <tr>
              <th>Custom URL</th>
              <td>
                <input ref='url' type='text' placeholder='Enter URL' />
                <button onClick={() => this.setState({ url: this.refs.url.value })}>Load</button>
              </td>
            </tr>
            <tr>
              <th>Custom config</th>
              <td>
                <textarea ref='config' placeholder='Enter JSON'></textarea>
                <button onClick={this.onConfigSubmit}>Update Config</button>
              </td>
            </tr>
          </tbody></table>

          <h2>State</h2>

          <table><tbody>
            <tr>
              <th>url</th>
              <td className={ !this.state.url ? 'faded' : '' }>{ this.state.url || 'null' }</td>
            </tr>
            <tr>
              <th>playing</th>
              <td>{ this.state.playing ? 'true' : 'false' }</td>
            </tr>
            <tr>
              <th>volume</th>
              <td>{ this.state.volume.toFixed(3) }</td>
            </tr>
            <tr>
              <th>played</th>
              <td>{ this.state.played.toFixed(3) }</td>
            </tr>
            <tr>
              <th>loaded</th>
              <td>{ this.state.loaded.toFixed(3) }</td>
            </tr>
          </tbody></table>
        </section>
      </div>
    )
  }
}
