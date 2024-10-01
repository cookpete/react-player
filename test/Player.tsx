import './helpers/server-safe-globals';
import { test } from 'zora';
import sinon from 'sinon';
import { ReactTestRenderer, create, act } from 'react-test-renderer';
import React from 'react';
import Player from '../src/Player';
import HtmlPlayer from '../src/HtmlPlayer';

function render(comp: React.ReactElement): ReactTestRenderer {
  let result;
  act(() => {
    result = create(comp, {
      createNodeMock: (element) => {
        if (element.type === 'video') {
          const video = document.createElement('video');
          video.setAttribute('src', element.props.src);
          return video;
        }
      },
    });
  });
  return result;
}

test('video.load()', async (t) => {
  const videoRef: React.Ref<HTMLVideoElement> = React.createRef();
  render(<Player ref={videoRef} src="file.mp4" activePlayer={HtmlPlayer} />);

  const loadstart = sinon.fake();
  videoRef.current?.addEventListener('loadstart', loadstart);

  await Promise.resolve();
  t.ok(loadstart.calledOnce);
});

test('video.play()', async (t) => {
  const videoRef: React.Ref<HTMLVideoElement> = React.createRef();
  const wrapper = render(<Player ref={videoRef} src="file.mp4" activePlayer={HtmlPlayer} />);

  const play = sinon.fake();
  videoRef.current?.addEventListener('play', play);

  act(() => {
    wrapper.update(<Player ref={videoRef} src="file.mp4" playing activePlayer={HtmlPlayer} />);
  });
  await Promise.resolve();

  t.ok(play.calledOnce);
  t.equal(videoRef.current?.paused, false);
});

// test('player.pause()', t => {
//   const wrapper = create(<Player playing />)
//   const load = sinon.fake()
//   const pause = sinon.fake()
//   wrapper.getInstance().handlePlayerMount({ load, pause })
//   wrapper.getInstance().isPlaying = true
//   setProps(wrapper, { playing: false })
//   t.ok(pause.calledOnce)
// })

// test('player.setVolume()', t => {
//   const wrapper = create(<Player volume={0.5} />)
//   const load = sinon.fake()
//   const setVolume = sinon.fake()
//   wrapper.getInstance().handlePlayerMount({ load, setVolume })
//   setProps(wrapper, { volume: 0.4 })
//   t.ok(setVolume.calledOnce)
// })

// test('player.mute()', t => {
//   const wrapper = create(<Player muted={false} />)
//   const load = sinon.fake()
//   const mute = sinon.fake()
//   wrapper.getInstance().handlePlayerMount({ load, mute })
//   setProps(wrapper, { muted: true })
//   t.ok(mute.calledOnce)
// })

// test('player.unmute()', async t => {
//   const wrapper = create(<Player muted volume={0.8} />)
//   const load = sinon.fake()
//   const unmute = sinon.fake()
//   const setVolume = sinon.fake()
//   wrapper.getInstance().handlePlayerMount({ load, unmute, setVolume })
//   setProps(wrapper, { muted: false })
//   t.ok(unmute.calledOnce)
//   return new Promise(resolve => setTimeout(() => {
//     t.ok(setVolume.calledOnceWith(0.8))
//     resolve()
//   }))
// })

// test('player.setPlaybackRate()', t => {
//   const wrapper = create(<Player playbackRate={1} />)
//   const load = sinon.fake()
//   const setPlaybackRate = sinon.fake()
//   wrapper.getInstance().handlePlayerMount({ load, setPlaybackRate })
//   setProps(wrapper, { playbackRate: 0.5 })
//   t.ok(setPlaybackRate.calledOnce)
// })

// const COMMON_METHODS = ['getDuration', 'getCurrentTime', 'getSecondsLoaded']

// for (const method of COMMON_METHODS) {
//   test(`${method}()`, t => {
//     const instance = create(<Player />).getInstance()
//     instance.player = { [method]: () => 123 }
//     instance.isReady = true
//     t.ok(instance[method]() === 123)
//   })

//   test(`${method}() - null`, t => {
//     const instance = create(<Player />).getInstance()
//     t.ok(instance[method]() === null)
//   })
// }

// test('progress()', t => {
//   const load = sinon.fake()
//   const onProgress = sinon.fake()
//   const instance = create(<Player url='file.mp4' onProgress={onProgress} />).getInstance()
//   instance.handlePlayerMount({
//     load,
//     getCurrentTime: sinon.fake.returns(10),
//     getSecondsLoaded: sinon.fake.returns(20),
//     getDuration: sinon.fake.returns(40)
//   })
//   instance.isReady = true
//   instance.progress()
//   instance.progress() // Call twice to ensure onProgress is not called again
//   t.ok(onProgress.calledOnceWith({
//     loaded: 0.5,
//     loadedSeconds: 20,
//     played: 0.25,
//     playedSeconds: 10
//   }))
// })

// test('progress() handlePlayerMount', t => {
//   const load = sinon.fake()
//   const onProgress = sinon.fake()
//   const instance = create(<Player url='file.mp4' onProgress={onProgress} />).getInstance()
//   instance.isReady = true
//   instance.handlePlayerMount({
//     load,
//     getCurrentTime: sinon.fake.returns(10),
//     getSecondsLoaded: sinon.fake.returns(20),
//     getDuration: sinon.fake.returns(40)
//   })
//   t.ok(onProgress.calledWith({
//     loaded: 0.5,
//     loadedSeconds: 20,
//     played: 0.25,
//     playedSeconds: 10
//   }))
// })

// test('seekTo() - seconds', t => {
//   const load = sinon.fake()
//   const seekTo = sinon.fake()
//   const instance = create(<Player />).getInstance()
//   instance.handlePlayerMount({ load, seekTo })
//   instance.isReady = true
//   instance.seekTo(10)
//   t.ok(seekTo.calledOnceWith(10))
// })

// test('seekTo() - fraction', t => {
//   const load = sinon.fake()
//   const seekTo = sinon.fake()
//   const instance = create(<Player />).getInstance()
//   instance.handlePlayerMount({
//     load,
//     seekTo,
//     getDuration: sinon.fake.returns(10)
//   })
//   instance.isReady = true
//   instance.seekTo(0.5)
//   t.ok(seekTo.calledOnceWith(5))
// })

// test('seekTo() - warning', t => {
//   const stub = sinon.stub(console, 'warn')
//   const load = sinon.fake()
//   const seekTo = sinon.fake()
//   const instance = create(<Player />).getInstance()
//   instance.handlePlayerMount({
//     load,
//     seekTo,
//     getDuration: sinon.fake.returns(null)
//   })
//   instance.isReady = true
//   instance.seekTo(0.5)
//   t.ok(seekTo.notCalled)
//   t.ok(stub.calledOnce)
//   stub.restore()
// })

// test('seekTo() - set seekOnPlay', t => {
//   const load = sinon.fake()
//   const seekTo = sinon.fake()
//   const instance = create(<Player />).getInstance()
//   instance.handlePlayerMount({ load, seekTo })
//   instance.isReady = false
//   instance.seekTo(10)
//   t.ok(seekTo.notCalled)
//   t.ok(instance.seekOnPlay === 10)
// })

// test('onReady()', t => {
//   const onReady = sinon.fake()
//   const load = sinon.fake()
//   const setVolume = sinon.fake()
//   const play = sinon.fake()
//   const instance = create(<Player onReady={onReady} playing volume={1} />).getInstance()
//   instance.handlePlayerMount({ load, setVolume, play })
//   instance.handleDurationCheck = sinon.fake()
//   instance.isReady = true
//   instance.handleReady()
//   t.ok(setVolume.calledOnceWith(1))
//   t.ok(play.calledOnce)
// })

// test('loadOnReady', t => {
//   const load = sinon.fake()
//   const play = sinon.fake()
//   const instance = create(<Player />).getInstance()
//   instance.handlePlayerMount({ load, play })
//   instance.handleDurationCheck = sinon.fake()
//   instance.loadOnReady = 'file.mp4'
//   instance.handleReady()
//   t.ok(load.calledWith('file.mp4'))
//   t.ok(play.notCalled)
// })

// test('onPlay()', t => {
//   const onPlay = sinon.fake()
//   const instance = create(<Player onPlay={onPlay} />).getInstance()
//   instance.handlePlayerMount({ load: () => {} })
//   instance.handleDurationCheck = sinon.fake()
//   instance.handlePlay()
//   t.ok(onPlay.calledOnce)
//   t.ok(instance.isPlaying)
//   t.notOk(instance.isLoading)
// })

// test('onStart()', t => {
//   const onStart = sinon.fake()
//   const instance = create(<Player onStart={onStart} />).getInstance()
//   instance.handlePlayerMount({ load: () => {} })
//   instance.handleDurationCheck = sinon.fake()
//   instance.startOnPlay = true
//   instance.handlePlay()
//   t.ok(onStart.calledOnce)
//   t.notOk(instance.startOnPlay)
// })

// test('seekOnPlay', t => {
//   const seekTo = sinon.stub(Player.prototype, 'seekTo')
//   const instance = create(<Player />).getInstance()
//   instance.handlePlayerMount({ load: () => {} })
//   instance.handleDurationCheck = sinon.fake()
//   instance.seekOnPlay = 10
//   instance.handlePlay()
//   t.ok(seekTo.calledOnceWith(10))
//   t.ok(instance.seekOnPlay === null)
//   seekTo.restore()
// })

// test('onPause()', t => {
//   const onPause = sinon.fake()
//   const instance = create(<Player onPause={onPause} />).getInstance()
//   instance.isLoading = false
//   instance.handlePause()
//   t.ok(onPause.calledOnce)
//   t.notOk(instance.isPlaying)
// })

// test('onPause() - isLoading', t => {
//   const onPause = sinon.fake()
//   const instance = create(<Player onPause={onPause} />).getInstance()
//   instance.isLoading = true
//   instance.handlePause()
//   t.ok(onPause.notCalled)
// })

// test('onEnded()', t => {
//   const activePlayer = () => null
//   const onEnded = sinon.fake()
//   const instance = create(<Player activePlayer={activePlayer} onEnded={onEnded} />).getInstance()
//   instance.isPlaying = true
//   instance.handleEnded()
//   t.ok(onEnded.calledOnce)
//   t.notOk(instance.isPlaying)
// })

// test('loopOnEnded', t => {
//   const activePlayer = () => null
//   activePlayer.loopOnEnded = true
//   const seekTo = sinon.stub(Player.prototype, 'seekTo')
//   const instance = create(<Player loop activePlayer={activePlayer} />).getInstance()
//   instance.handlePlayerMount({ load: () => {} })
//   instance.isPlaying = true
//   instance.handleEnded()
//   t.ok(seekTo.calledOnceWith(0))
//   t.ok(instance.isPlaying)
//   seekTo.restore()
// })

// test('handleDurationCheck', t => {
//   const onDuration = sinon.fake()
//   const instance = create(<Player onDuration={onDuration} />).getInstance()
//   instance.getDuration = sinon.fake.returns(10)
//   instance.handleDurationCheck()
//   instance.handleDurationCheck() // Call twice to ensure onDuration is not called again
//   t.ok(onDuration.calledOnceWith(10))
//   t.ok(instance.onDurationCalled)
// })

// test('durationCheckTimeout', t => {
//   const onDuration = sinon.fake()
//   const instance = create(<Player onDuration={onDuration} />).getInstance()
//   instance.getDuration = sinon.fake.returns(null)
//   instance.durationCheckTimeout = null
//   instance.handleDurationCheck()
//   t.ok(onDuration.notCalled)
//   t.truthy(instance.durationCheckTimeout)
// })
