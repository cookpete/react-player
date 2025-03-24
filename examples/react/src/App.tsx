// biome-ignore lint/style/useImportType:
import React, { Component } from 'react';
import screenfull from 'screenfull';

import { version } from '../../../package.json';
import ReactPlayer from '../../../';
import Duration from './Duration';

class App extends Component {
  player: HTMLVideoElement | null = null;
  urlInput: HTMLInputElement | null = null;

  state = {
    src: '',
    pip: false,
    playing: false,
    controls: false,
    light: false,
    volume: 1,
    muted: false,
    played: 0,
    loaded: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: false,
    seeking: false,
  };

  load = (src?: string) => {
    this.setState({
      src,
      played: 0,
      loaded: 0,
      pip: false,
    });
  };

  handlePlayPause = () => {
    this.setState({ playing: !this.state.playing });
  };

  handleStop = () => {
    this.setState({ src: '', playing: false });
  };

  handleToggleControls = () => {
    this.setState({ controls: !this.state.controls });
  };

  handleToggleLight = () => {
    this.setState({ light: !this.state.light });
  };

  handleToggleLoop = () => {
    this.setState({ loop: !this.state.loop });
  };

  handleVolumeChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    this.setState({ volume: Number.parseFloat(e.currentTarget.value) });
  };

  handleToggleMuted = () => {
    this.setState({ muted: !this.state.muted });
  };

  handleSetPlaybackRate = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    this.setState({ playbackRate: Number.parseFloat(`${e.currentTarget.dataset.value}`) });
  };

  handleRateChange = () => {
    this.setState({ playbackRate: this.player?.playbackRate });
  };

  handleTogglePIP = () => {
    this.setState({ pip: !this.state.pip });
  };

  handlePlay = () => {
    console.log('onPlay');
    this.setState({ playing: true });
  };

  handleEnterPictureInPicture = () => {
    console.log('onEnterPictureInPicture');
    this.setState({ pip: true });
  };

  handleLeavePictureInPicture = () => {
    console.log('onLeavePictureInPicture');
    this.setState({ pip: false });
  };

  handlePause = () => {
    console.log('onPause');
    this.setState({ playing: false });
  };

  handleSeekMouseDown = () => {
    this.setState({ seeking: true });
  };

  handleSeekChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    this.setState({ played: Number.parseFloat(e.currentTarget.value) });
  };

  handleSeekMouseUp = (e: React.SyntheticEvent<HTMLInputElement>) => {
    this.setState({ seeking: false });
    if (this.player) {
      this.player.currentTime = Number.parseFloat(e.currentTarget.value) * this.player.duration;
    }
  };

  handleProgress = () => {
    // We only want to update time slider if we are not currently seeking
    if (!this.player || this.state.seeking) return;

    console.log('onProgress');

    this.setState({
      loadedSeconds: this.player.buffered?.end(this.player.buffered?.length - 1),
      loaded: this.player.buffered?.end(this.player.buffered?.length - 1) / this.player.duration,
    });
  };

  handleTimeUpdate = () => {
    // We only want to update time slider if we are not currently seeking
    if (!this.player || this.state.seeking) return;

    console.log('onTimeUpdate', this.player?.currentTime);

    if (!this.player?.duration) return;

    this.setState({
      playedSeconds: this.player.currentTime,
      played: this.player.currentTime / this.player.duration,
    });
  };

  handleEnded = () => {
    console.log('onEnded');
    this.setState({ playing: this.state.loop });
  };

  handleDurationChange = () => {
    if (!this.player) return;

    console.log('onDuration', this.player.duration);
    this.setState({ duration: this.player.duration });
  };

  handleClickFullscreen = () => {
    const reactPlayer = document.querySelector('.react-player');
    if (reactPlayer) screenfull.request(reactPlayer);
  };

  renderLoadButton = (src: string, label: string) => {
    return (
      <button type="button" onClick={() => this.load(src)}>
        {label}
      </button>
    );
  };

  ref = (player: HTMLVideoElement) => {
    this.player = player;
    console.log(player);
  };

  render() {
    const {
      src,
      playing,
      controls,
      light,
      volume,
      muted,
      loop,
      played,
      loaded,
      duration,
      playbackRate,
      pip,
    } = this.state;
    const SEPARATOR = ' · ';

    return (
      <div className="app">
        <section className="section">
          <h1>ReactPlayer Demo</h1>
          <div className="player-wrapper">
            <ReactPlayer
              ref={this.ref}
              className="react-player"
              width="100%"
              height="100%"
              src={src}
              pip={pip}
              playing={playing}
              controls={controls}
              light={light}
              loop={loop}
              playbackRate={playbackRate}
              volume={volume}
              muted={muted}
              config={{
                youtube: {
                  color: 'white'
                },
                vimeo: {
                  color: 'ffffff'
                }
              }}
              onLoadStart={() => console.log('onLoadStart')}
              onReady={() => console.log('onReady')}
              onStart={(e) => console.log('onStart', e)}
              onPlay={this.handlePlay}
              onEnterPictureInPicture={this.handleEnterPictureInPicture}
              onLeavePictureInPicture={this.handleLeavePictureInPicture}
              onPause={this.handlePause}
              onRateChange={this.handleRateChange}
              onSeeking={(e) => console.log('onSeeking', e)}
              onSeeked={(e) => console.log('onSeeked', e)}
              onEnded={this.handleEnded}
              onError={(e) => console.log('onError', e)}
              onTimeUpdate={this.handleTimeUpdate}
              onProgress={this.handleProgress}
              onDurationChange={this.handleDurationChange}
            />
          </div>

          <table>
            <tbody>
              <tr>
                <th>Controls</th>
                <td>
                  <button type="button" onClick={this.handleStop}>
                    Stop
                  </button>
                  <button type="button" onClick={this.handlePlayPause}>
                    {playing ? 'Pause' : 'Play'}
                  </button>
                  <button type="button" onClick={this.handleClickFullscreen}>
                    Fullscreen
                  </button>
                  {ReactPlayer.canEnablePIP?.(src) && (
                    <button type="button" onClick={this.handleTogglePIP}>
                      {pip ? 'Disable PiP' : 'Enable PiP'}
                    </button>
                  )}
                </td>
              </tr>
              <tr>
                <th>Speed</th>
                <td>
                  <button type="button" onClick={this.handleSetPlaybackRate} data-value={1}>
                    1x
                  </button>
                  <button type="button" onClick={this.handleSetPlaybackRate} data-value={1.5}>
                    1.5x
                  </button>
                  <button type="button" onClick={this.handleSetPlaybackRate} data-value={2}>
                    2x
                  </button>
                </td>
              </tr>
              <tr>
                <th>Seek</th>
                <td>
                  <input
                    type="range"
                    min={0}
                    max={0.999999}
                    step="any"
                    value={played}
                    onMouseDown={this.handleSeekMouseDown}
                    onChange={this.handleSeekChange}
                    onMouseUp={this.handleSeekMouseUp}
                  />
                </td>
              </tr>
              <tr>
                <th>Volume</th>
                <td>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step="any"
                    value={volume}
                    onChange={this.handleVolumeChange}
                  />
                </td>
              </tr>
              <tr>
                <th>
                  <label htmlFor="controls">Controls</label>
                </th>
                <td>
                  <input
                    id="controls"
                    type="checkbox"
                    checked={controls}
                    onChange={this.handleToggleControls}
                  />
                  <em>&nbsp; Requires player reload for some players</em>
                </td>
              </tr>
              <tr>
                <th>
                  <label htmlFor="muted">Muted</label>
                </th>
                <td>
                  <input
                    id="muted"
                    type="checkbox"
                    checked={muted}
                    onChange={this.handleToggleMuted}
                  />
                </td>
              </tr>
              <tr>
                <th>
                  <label htmlFor="loop">Loop</label>
                </th>
                <td>
                  <input
                    id="loop"
                    type="checkbox"
                    checked={loop}
                    onChange={this.handleToggleLoop}
                  />
                </td>
              </tr>
              <tr>
                <th>
                  <label htmlFor="light">Light mode</label>
                </th>
                <td>
                  <input
                    id="light"
                    type="checkbox"
                    checked={light}
                    onChange={this.handleToggleLight}
                  />
                </td>
              </tr>
              <tr>
                <th>Played</th>
                <td>
                  <progress max={1} value={played} />
                </td>
              </tr>
              <tr>
                <th>Loaded</th>
                <td>
                  <progress max={1} value={loaded} />
                </td>
              </tr>
            </tbody>
          </table>
        </section>
        <section className="section">
          <table>
            <tbody>
              <tr>
                <th>HTML</th>
                <td>
                  {this.renderLoadButton(
                    'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
                    'mp4'
                  )}
                  {this.renderLoadButton(
                    'https://test-videos.co.uk/vids/bigbuckbunny/webm/vp8/360/Big_Buck_Bunny_360_10s_1MB.webm',
                    'webm'
                  )}
                  {this.renderLoadButton(
                    'https://filesamples.com/samples/video/ogv/sample_640x360.ogv',
                    'ogv'
                  )}
                  {this.renderLoadButton(
                    'https://storage.googleapis.com/media-session/elephants-dream/the-wires.mp3',
                    'mp3'
                  )}
                </td>
              </tr>
              <tr>
                <th>HLS</th>
                <td>
                  {this.renderLoadButton(
                    'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
                    'HLS (m3u8)'
                  )}
                </td>
              </tr>
              <tr>
                <th>DASH</th>
                <td>
                  {this.renderLoadButton(
                    'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps_640x360_800k.mpd',
                    'DASH (mpd)'
                  )}
                </td>
              </tr>
              <tr>
                <th>Mux</th>
                <td>
                  {this.renderLoadButton(
                    'https://stream.mux.com/maVbJv2GSYNRgS02kPXOOGdJMWGU1mkA019ZUjYE7VU7k',
                    'Test A'
                  )}
                  {this.renderLoadButton(
                    'https://stream.mux.com/Sc89iWAyNkhJ3P1rQ02nrEdCFTnfT01CZ2KmaEcxXfB008',
                    'Test B'
                  )}
                </td>
              </tr>
              <tr>
                <th>YouTube</th>
                <td>
                  {this.renderLoadButton('https://www.youtube.com/watch?v=oUFJJNQGwhk', 'Test A')}
                  {this.renderLoadButton('https://www.youtube.com/watch?v=jNgP6d9HraI', 'Test B')}
                </td>
              </tr>
              <tr>
                <th>Vimeo</th>
                <td>
                  {this.renderLoadButton('https://vimeo.com/90509568', 'Test A')}
                  {this.renderLoadButton('https://vimeo.com/169599296', 'Test B')}
                </td>
              </tr>
              <tr>
                <th>Wistia</th>
                <td>
                  {this.renderLoadButton('https://home.wistia.com/medias/e4a27b971d', 'Test A')}
                  {this.renderLoadButton('https://home.wistia.com/medias/29b0fbf547', 'Test B')}
                  {this.renderLoadButton('https://home.wistia.com/medias/bq6epni33s', 'Test C')}
                </td>
              </tr>
              <tr>
                <th>Custom</th>
                <td>
                  <input
                    ref={(input) => {
                      this.urlInput = input;
                    }}
                    type="text"
                    placeholder="Enter URL"
                  />
                  <button
                    type="button"
                    onClick={() => this.setState({ src: this.urlInput?.value })}
                  >
                    Load
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <h2>State</h2>

          <table>
            <tbody>
              <tr>
                <th>src</th>
                <td className={!src ? 'faded' : ''}>{src || 'null'}</td>
              </tr>
              <tr>
                <th>playing</th>
                <td>{playing ? 'true' : 'false'}</td>
              </tr>
              <tr>
                <th>volume</th>
                <td>{volume.toFixed(3)}</td>
              </tr>
              <tr>
                <th>speed</th>
                <td>{playbackRate}</td>
              </tr>
              <tr>
                <th>played</th>
                <td>{played.toFixed(3)}</td>
              </tr>
              <tr>
                <th>loaded</th>
                <td>{loaded.toFixed(3)}</td>
              </tr>
              <tr>
                <th>duration</th>
                <td>
                  <Duration seconds={duration} />
                </td>
              </tr>
              <tr>
                <th>elapsed</th>
                <td>
                  <Duration seconds={duration * played} />
                </td>
              </tr>
              <tr>
                <th>remaining</th>
                <td>
                  <Duration seconds={duration * (1 - played)} />
                </td>
              </tr>
            </tbody>
          </table>
        </section>
        <footer className="footer">
          Version <strong>{version}</strong>
          {SEPARATOR}
          <a href="https://github.com/CookPete/react-player">GitHub</a>
          {SEPARATOR}
          <a href="https://www.npmjs.com/package/react-player">npm</a>
        </footer>
      </div>
    );
  }
}

export default App;
