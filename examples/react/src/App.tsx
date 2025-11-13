// biome-ignore lint/style/useImportType:
import React, { useState, useRef, useCallback } from 'react';
import screenfull from 'screenfull';

import { version } from '../../../package.json';
import ReactPlayer from '../../../';
import Duration from './Duration';

const App = () => {
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const urlInputRef = useRef<HTMLInputElement | null>(null);

  const initialState = {
    src: undefined,
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
    loadedSeconds: 0,
    playedSeconds: 0,
  };

  type PlayerState = Omit<typeof initialState, 'src'> & {
    src?: string;
  };

  const [state, setState] = useState<PlayerState>(initialState);

  const load = (src?: string) => {
    setState(prevState => ({
      ...prevState,
      src,
      played: 0,
      loaded: 0,
      pip: false,
    }));
  };

  const handlePlayPause = () => {
    setState(prevState => ({ ...prevState, playing: !prevState.playing }));
  };

  const handleStop = () => {
    setState(prevState => ({ ...prevState, src: undefined, playing: false }));
  };

  const handleToggleControls = () => {
    setState(prevState => ({ ...prevState, controls: !prevState.controls }));
  };

  const handleToggleLight = () => {
    setState(prevState => ({ ...prevState, light: !prevState.light }));
  };

  const handleToggleLoop = () => {
    setState(prevState => ({ ...prevState, loop: !prevState.loop }));
  };

  const handleVolumeChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const inputTarget = event.target as HTMLInputElement;
    setState(prevState => ({ ...prevState, volume: Number.parseFloat(inputTarget.value) }));
  };

  const handleToggleMuted = () => {
    setState(prevState => ({ ...prevState, muted: !prevState.muted }));
  };

  const handleSetPlaybackRate = (event: React.SyntheticEvent<HTMLButtonElement>) => {
    const buttonTarget = event.target as HTMLButtonElement;
    setState(prevState => ({
      ...prevState,
      playbackRate: Number.parseFloat(`${buttonTarget.dataset.value}`)
    }));
  };

  const handleRateChange = () => {
    const player = playerRef.current;
    if (!player) return;

    setState(prevState => ({ ...prevState, playbackRate: player.playbackRate }));
  };

  const handleTogglePIP = () => {
    setState(prevState => ({ ...prevState, pip: !prevState.pip }));
  };

  const handlePlay = () => {
    console.log('onPlay');
    setState(prevState => ({ ...prevState, playing: true }));
  };

  const handleEnterPictureInPicture = () => {
    console.log('onEnterPictureInPicture');
    setState(prevState => ({ ...prevState, pip: true }));
  };

  const handleLeavePictureInPicture = () => {
    console.log('onLeavePictureInPicture');
    setState(prevState => ({ ...prevState, pip: false }));
  };

  const handlePause = () => {
    console.log('onPause');
    setState(prevState => ({ ...prevState, playing: false }));
  };

  const handleSeekMouseDown = () => {
    setState(prevState => ({ ...prevState, seeking: true }));
  };

  const handleSeekChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const inputTarget = event.target as HTMLInputElement;
    setState(prevState => ({ ...prevState, played: Number.parseFloat(inputTarget.value) }));
  };

  const handleSeekMouseUp = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const inputTarget = event.target as HTMLInputElement;
    setState(prevState => ({ ...prevState, seeking: false }));
    if (playerRef.current) {
      playerRef.current.currentTime = Number.parseFloat(inputTarget.value) * playerRef.current.duration;
    }
  };

  const handleProgress = () => {
    const player = playerRef.current;
    // We only want to update time slider if we are not currently seeking
    if (!player || state.seeking || !player.buffered?.length) return;

    console.log('onProgress');

    setState(prevState => ({
      ...prevState,
      loadedSeconds: player.buffered?.end(player.buffered?.length - 1),
      loaded: player.buffered?.end(player.buffered?.length - 1) / player.duration,
    }));
  };

  const handleTimeUpdate = () => {
    const player = playerRef.current;
    // We only want to update time slider if we are not currently seeking
    if (!player || state.seeking) return;

    console.log('onTimeUpdate', player.currentTime);

    if (!player.duration) return;

    setState(prevState => ({
      ...prevState,
      playedSeconds: player.currentTime,
      played: player.currentTime / player.duration,
    }));
  };

  const handleEnded = () => {
    console.log('onEnded');
    setState(prevState => ({ ...prevState, playing: prevState.loop }));
  };

  const handleDurationChange = () => {
    const player = playerRef.current;
    if (!player) return;

    console.log('onDurationChange', player.duration);
    setState(prevState => ({ ...prevState, duration: player.duration }));
  };

  const handleClickFullscreen = () => {
    const reactPlayer = document.querySelector('.react-player');
    if (reactPlayer) screenfull.request(reactPlayer);
  };

  const renderLoadButton = (src: string, label: string) => {
    return (
      <button type="button" onClick={() => load(src)}>
        {label}
      </button>
    );
  };

  const setPlayerRef = useCallback((player: HTMLVideoElement) => {
    if (!player) return;
    playerRef.current = player;
    console.log(player);
  }, []);

  const handleLoadCustomUrl = () => {
    if (urlInputRef.current?.value) {
      setState(prevState => ({ ...prevState, src: urlInputRef.current?.value }));
    }
  };

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
  } = state;

  const SEPARATOR = ' · ';

  return (
    <div className="app">
      <section className="section">
        <h1>ReactPlayer Demo</h1>
        <div className="player-wrapper">
          <ReactPlayer
            ref={setPlayerRef}
            className="react-player"
            style={{ width: '100%', height: 'auto', aspectRatio: '16/9' }}
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
              },
              spotify: {
                preferVideo: true
              },
              tiktok: {
                fullscreen_button: true,
                progress_bar: true,
                play_button: true,
                volume_control: true,
                timestamp: false,
                music_info: false,
                description: false,
                rel: false,
                native_context_menu: true,
                closed_caption: false,
              }
            }}
            onLoadStart={() => console.log('onLoadStart')}
            onReady={() => console.log('onReady')}
            onStart={(e) => console.log('onStart', e)}
            onPlay={handlePlay}
            onEnterPictureInPicture={handleEnterPictureInPicture}
            onLeavePictureInPicture={handleLeavePictureInPicture}
            onPause={handlePause}
            onRateChange={handleRateChange}
            onSeeking={(e) => console.log('onSeeking', e)}
            onSeeked={(e) => console.log('onSeeked', e)}
            onEnded={handleEnded}
            onError={(e) => console.log('onError', e)}
            onTimeUpdate={handleTimeUpdate}
            onProgress={handleProgress}
            onDurationChange={handleDurationChange}
          />
        </div>

        <table>
          <tbody>
            <tr>
              <th>Controls</th>
              <td>
                <button type="button" onClick={handleStop}>
                  Stop
                </button>
                <button type="button" onClick={handlePlayPause}>
                  {playing ? 'Pause' : 'Play'}
                </button>
                <button type="button" onClick={handleClickFullscreen}>
                  Fullscreen
                </button>
                {src && ReactPlayer.canEnablePIP?.(src) && (
                  <button type="button" onClick={handleTogglePIP}>
                    {pip ? 'Disable PiP' : 'Enable PiP'}
                  </button>
                )}
              </td>
            </tr>
            <tr>
              <th>Speed</th>
              <td>
                <button type="button" onClick={handleSetPlaybackRate} data-value={1}>
                  1x
                </button>
                <button type="button" onClick={handleSetPlaybackRate} data-value={1.5}>
                  1.5x
                </button>
                <button type="button" onClick={handleSetPlaybackRate} data-value={2}>
                  2x
                </button>
              </td>
            </tr>
            <tr>
              <th><label htmlFor="seek">Seek</label></th>
              <td>
                <input
                  id="seek"
                  type="range"
                  min={0}
                  max={0.999999}
                  step="any"
                  value={played}
                  onMouseDown={handleSeekMouseDown}
                  onChange={handleSeekChange}
                  onMouseUp={handleSeekMouseUp}
                />
              </td>
            </tr>
            <tr>
              <th><label htmlFor="volume">Volume</label></th>
              <td>
                <input
                  id="volume"
                  type="range"
                  min={0}
                  max={1}
                  step="any"
                  value={volume}
                  onChange={handleVolumeChange}
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
                  onChange={handleToggleControls}
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
                  onChange={handleToggleMuted}
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
                  onChange={handleToggleLoop}
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
                  onChange={handleToggleLight}
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
                {renderLoadButton(
                  'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
                  'mp4'
                )}
                {renderLoadButton(
                  'https://test-videos.co.uk/vids/bigbuckbunny/webm/vp8/360/Big_Buck_Bunny_360_10s_1MB.webm',
                  'webm'
                )}
                {renderLoadButton(
                  'https://filesamples.com/samples/video/ogv/sample_640x360.ogv',
                  'ogv'
                )}
                {renderLoadButton(
                  'https://storage.googleapis.com/media-session/elephants-dream/the-wires.mp3',
                  'mp3'
                )}
              </td>
            </tr>
            <tr>
              <th>HLS</th>
              <td>
                {renderLoadButton(
                  'https://stream.mux.com/VcmKA6aqzIzlg3MayLJDnbF55kX00mds028Z65QxvBYaA.m3u8',
                  'HLS (m3u8)'
                )}
              </td>
            </tr>
            <tr>
              <th>DASH</th>
              <td>
                {renderLoadButton(
                  'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps_640x360_800k.mpd',
                  'DASH (mpd)'
                )}
              </td>
            </tr>
            <tr>
              <th>Mux</th>
              <td>
                {renderLoadButton(
                  'https://stream.mux.com/maVbJv2GSYNRgS02kPXOOGdJMWGU1mkA019ZUjYE7VU7k',
                  'Test A'
                )}
                {renderLoadButton(
                  'https://stream.mux.com/Sc89iWAyNkhJ3P1rQ02nrEdCFTnfT01CZ2KmaEcxXfB008',
                  'Test B'
                )}
              </td>
            </tr>
            <tr>
              <th>YouTube</th>
              <td>
                {renderLoadButton('https://www.youtube.com/watch?v=oUFJJNQGwhk', 'Test A')}
                {renderLoadButton('https://www.youtube.com/watch?v=jNgP6d9HraI', 'Test B')}
                {renderLoadButton('https://www.youtube.com/playlist?list=PLRfhDHeBTBJ7MU5DX4P_oBIRN457ah9lA', 'Playlist')}
              </td>
            </tr>
            <tr>
              <th>Vimeo</th>
              <td>
                {renderLoadButton('https://vimeo.com/90509568', 'Test A')}
                {renderLoadButton('https://vimeo.com/169599296', 'Test B')}
              </td>
            </tr>
            <tr>
              <th>Wistia</th>
              <td>
                {renderLoadButton('https://home.wistia.com/medias/e4a27b971d', 'Test A')}
                {renderLoadButton('https://home.wistia.com/medias/29b0fbf547', 'Test B')}
                {renderLoadButton('https://home.wistia.com/medias/bq6epni33s', 'Test C')}
              </td>
            </tr>
            <tr>
              <th>Spotify</th>
              <td>
                {renderLoadButton('https://open.spotify.com/episode/5Jo9ncrz2liWiKj8inZwD2', 'Test A')}
              </td>
            </tr>
            <tr>
              <th>Twitch</th>
              <td>
                {renderLoadButton('https://www.twitch.tv/videos/106400740', 'Test A')}
                {renderLoadButton('https://www.twitch.tv/kronovi', 'Test B')}
              </td>
            </tr>
            <tr>
              <th>TikTok</th>
              <td>
                {renderLoadButton('https://www.tiktok.com/@_luwes/video/7527476667770522893', 'Test A')}
                {renderLoadButton('https://www.tiktok.com/@scout2015/video/6718335390845095173', 'Test B')}
              </td>
            </tr>
            <tr>
              <th>Custom</th>
              <td>
                <input
                  ref={urlInputRef}
                  type="text"
                  placeholder="Enter URL"
                />
                <button
                  type="button"
                  onClick={handleLoadCustomUrl}
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
};

export default App;
