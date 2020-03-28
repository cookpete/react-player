import React from 'react'
import test from 'ava'
import sinon from 'sinon'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Player from '../src/Player'

configure({ adapter: new Adapter() })

Player.prototype.componentWillMount = function () {
  this.handlePlayerMount({ load: () => null })
}

test('componentWillUnmount()', t => {
  const wrapper = shallow(<Player />)
  const fake = sinon.fake()
  wrapper.instance().isReady = true
  wrapper.instance().player = { stop: fake }
  wrapper.unmount()
  t.true(fake.calledOnce)
})

test('getInternalPlayer()', t => {
  const wrapper = shallow(<Player />)
  wrapper.instance().player = { abc: 123 }
  t.true(wrapper.instance().getInternalPlayer('abc') === 123)
})

test('getInternalPlayer() - null', t => {
  const wrapper = shallow(<Player />)
  wrapper.instance().player = null
  t.true(wrapper.instance().getInternalPlayer() === null)
})

test('player.load()', t => {
  const wrapper = shallow(<Player url='file.mp4' />)
  const instance = wrapper.instance()
  const fake = sinon.fake()
  instance.handlePlayerMount({ load: fake })
  instance.isLoading = false
  instance.startOnPlay = false
  instance.onDurationCalled = true
  wrapper.setProps({ url: 'another-file.mp4' })
  t.true(fake.calledTwice)
  t.true(fake.calledWith('file.mp4'))
  t.true(fake.calledWith('another-file.mp4'))
  t.true(instance.isLoading)
  t.true(instance.startOnPlay)
  t.false(instance.onDurationCalled)
})

test('set loadOnReady', t => {
  const stub = sinon.stub(console, 'warn')
  const wrapper = shallow(<Player url='file.mp4' activePlayer={() => null} />)
  const instance = wrapper.instance()
  instance.isLoading = true
  wrapper.setProps({ url: 'another-file.mp4' })
  t.true(stub.calledOnce)
  t.true(instance.loadOnReady === 'another-file.mp4')
  stub.restore()
})

test('player.play()', t => {
  const wrapper = shallow(<Player />)
  const load = sinon.fake()
  const play = sinon.fake()
  wrapper.instance().handlePlayerMount({ load, play })
  wrapper.setProps({ playing: true })
  t.true(play.calledOnce)
})

test('player.pause()', t => {
  const wrapper = shallow(<Player playing />)
  const load = sinon.fake()
  const pause = sinon.fake()
  wrapper.instance().handlePlayerMount({ load, pause })
  wrapper.instance().isPlaying = true
  wrapper.setProps({ playing: false })
  t.true(pause.calledOnce)
})

test('player.setVolume()', t => {
  const wrapper = shallow(<Player volume={0.5} />)
  const load = sinon.fake()
  const setVolume = sinon.fake()
  wrapper.instance().handlePlayerMount({ load, setVolume })
  wrapper.setProps({ volume: 0.4 })
  t.true(setVolume.calledOnce)
})

test('player.mute()', t => {
  const wrapper = shallow(<Player muted={false} />)
  const load = sinon.fake()
  const mute = sinon.fake()
  wrapper.instance().handlePlayerMount({ load, mute })
  wrapper.setProps({ muted: true })
  t.true(mute.calledOnce)
})

test('player.unmute()', t => {
  const wrapper = shallow(<Player muted volume={0.8} />)
  const load = sinon.fake()
  const unmute = sinon.fake()
  const setVolume = sinon.fake()
  wrapper.instance().handlePlayerMount({ load, unmute, setVolume })
  wrapper.setProps({ muted: false })
  t.true(unmute.calledOnce)
  return new Promise(resolve => setTimeout(() => {
    t.true(setVolume.calledOnceWith(0.8))
    resolve()
  }))
})

test('player.setPlaybackRate()', t => {
  const wrapper = shallow(<Player playbackRate={1} />)
  const load = sinon.fake()
  const setPlaybackRate = sinon.fake()
  wrapper.instance().handlePlayerMount({ load, setPlaybackRate })
  wrapper.setProps({ playbackRate: 0.5 })
  t.true(setPlaybackRate.calledOnce)
})

const COMMON_METHODS = ['getDuration', 'getCurrentTime', 'getSecondsLoaded']

for (const method of COMMON_METHODS) {
  test(`${method}()`, t => {
    const instance = shallow(<Player />).instance()
    instance.player = { [method]: () => 123 }
    instance.isReady = true
    t.true(instance[method]() === 123)
  })

  test(`${method}() - null`, t => {
    const instance = shallow(<Player />).instance()
    t.true(instance[method]() === null)
  })
}

test('progress()', t => {
  const load = sinon.fake()
  const onProgress = sinon.fake()
  const instance = shallow(<Player url='file.mp4' onProgress={onProgress} />).instance()
  instance.handlePlayerMount({
    load,
    getCurrentTime: sinon.fake.returns(10),
    getSecondsLoaded: sinon.fake.returns(20),
    getDuration: sinon.fake.returns(40)
  })
  instance.isReady = true
  instance.progress()
  instance.progress() // Call twice to ensure onProgress is not called again
  t.true(onProgress.calledOnceWith({
    loaded: 0.5,
    loadedSeconds: 20,
    played: 0.25,
    playedSeconds: 10
  }))
})

test('seekTo() - seconds', t => {
  const load = sinon.fake()
  const seekTo = sinon.fake()
  const instance = shallow(<Player />).instance()
  instance.handlePlayerMount({ load, seekTo })
  instance.isReady = true
  instance.seekTo(10)
  t.true(seekTo.calledOnceWith(10))
})

test('seekTo() - fraction', t => {
  const load = sinon.fake()
  const seekTo = sinon.fake()
  const instance = shallow(<Player />).instance()
  instance.handlePlayerMount({
    load,
    seekTo,
    getDuration: sinon.fake.returns(10)
  })
  instance.isReady = true
  instance.seekTo(0.5)
  t.true(seekTo.calledOnceWith(5))
})

test('seekTo() - warning', t => {
  const stub = sinon.stub(console, 'warn')
  const load = sinon.fake()
  const seekTo = sinon.fake()
  const instance = shallow(<Player />).instance()
  instance.handlePlayerMount({
    load,
    seekTo,
    getDuration: sinon.fake.returns(null)
  })
  instance.isReady = true
  instance.seekTo(0.5)
  t.true(seekTo.notCalled)
  t.true(stub.calledOnce)
  stub.restore()
})

test('seekTo() - set seekOnPlay', t => {
  const load = sinon.fake()
  const seekTo = sinon.fake()
  const instance = shallow(<Player />).instance()
  instance.handlePlayerMount({ load, seekTo })
  instance.isReady = false
  instance.seekTo(10)
  t.true(seekTo.notCalled)
  t.true(instance.seekOnPlay === 10)
})

test('onReady()', t => {
  const onReady = sinon.fake()
  const load = sinon.fake()
  const setVolume = sinon.fake()
  const play = sinon.fake()
  const instance = shallow(<Player onReady={onReady} playing volume={1} />).instance()
  instance.handlePlayerMount({ load, setVolume, play })
  instance.handleDurationCheck = sinon.fake()
  instance.isReady = true
  instance.handleReady()
  t.true(setVolume.calledOnceWith(1))
  t.true(play.calledOnce)
})

test('loadOnReady', t => {
  const load = sinon.fake()
  const play = sinon.fake()
  const instance = shallow(<Player />).instance()
  instance.handlePlayerMount({ load, play })
  instance.handleDurationCheck = sinon.fake()
  instance.loadOnReady = 'file.mp4'
  instance.handleReady()
  t.true(load.calledWith('file.mp4'))
  t.true(play.notCalled)
})

test('onPlay()', t => {
  const onPlay = sinon.fake()
  const instance = shallow(<Player onPlay={onPlay} />).instance()
  instance.handleDurationCheck = sinon.fake()
  instance.handlePlay()
  t.true(onPlay.calledOnce)
  t.true(instance.isPlaying)
  t.false(instance.isLoading)
})

test('onStart()', t => {
  const onStart = sinon.fake()
  const instance = shallow(<Player onStart={onStart} />).instance()
  instance.handleDurationCheck = sinon.fake()
  instance.startOnPlay = true
  instance.handlePlay()
  t.true(onStart.calledOnce)
  t.false(instance.startOnPlay)
})

test('seekOnPlay', t => {
  const seekTo = sinon.stub(Player.prototype, 'seekTo')
  const instance = shallow(<Player />).instance()
  instance.handleDurationCheck = sinon.fake()
  instance.seekOnPlay = 10
  instance.handlePlay()
  t.true(seekTo.calledOnceWith(10))
  t.true(instance.seekOnPlay === null)
  seekTo.restore()
})

test('onPause()', t => {
  const onPause = sinon.fake()
  const instance = shallow(<Player onPause={onPause} />).instance()
  instance.isLoading = false
  instance.handlePause()
  t.true(onPause.calledOnce)
  t.false(instance.isPlaying)
})

test('onPause() - isLoading', t => {
  const onPause = sinon.fake()
  const instance = shallow(<Player onPause={onPause} />).instance()
  instance.isLoading = true
  instance.handlePause()
  t.true(onPause.notCalled)
})

test('onEnded()', t => {
  const activePlayer = () => null
  const onEnded = sinon.fake()
  const instance = shallow(<Player activePlayer={activePlayer} onEnded={onEnded} />).instance()
  instance.isPlaying = true
  instance.handleEnded()
  t.true(onEnded.calledOnce)
  t.false(instance.isPlaying)
})

test('loopOnEnded', t => {
  const activePlayer = () => null
  activePlayer.loopOnEnded = true
  const seekTo = sinon.stub(Player.prototype, 'seekTo')
  const instance = shallow(<Player loop activePlayer={activePlayer} />).instance()
  instance.isPlaying = true
  instance.handleEnded()
  t.true(seekTo.calledOnceWith(0))
  t.true(instance.isPlaying)
  seekTo.restore()
})

test('handleDurationCheck', t => {
  const onDuration = sinon.fake()
  const instance = shallow(<Player onDuration={onDuration} />).instance()
  instance.getDuration = sinon.fake.returns(10)
  instance.handleDurationCheck()
  instance.handleDurationCheck() // Call twice to ensure onDuration is not called again
  t.true(onDuration.calledOnceWith(10))
  t.true(instance.onDurationCalled)
})

test('durationCheckTimeout', t => {
  const onDuration = sinon.fake()
  const instance = shallow(<Player onDuration={onDuration} />).instance()
  instance.getDuration = sinon.fake.returns(null)
  instance.durationCheckTimeout = null
  instance.handleDurationCheck()
  t.true(onDuration.notCalled)
  t.truthy(instance.durationCheckTimeout)
})
