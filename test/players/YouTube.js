import React from 'react'
import test from 'ava'
import sinon from 'sinon'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import testPlayerMethods from '../helpers/testPlayerMethods'
import * as utils from '../../src/utils'
import YouTube from '../../src/players/YouTube'

global.window = {
  location: { origin: 'mock-origin' },
  YT: {
    PlayerState: {
      PLAYING: 'PLAYING',
      PAUSED: 'PAUSED',
      BUFFERING: 'BUFFERING',
      ENDED: 'ENDED',
      CUED: 'CUED'
    }
  }
}
global.document = { body: { contains: () => true } }

configure({ adapter: new Adapter() })

const TEST_URL = 'https://www.youtube.com/watch?v=oUFJJNQGwhk'
const TEST_CONFIG = {
  playerVars: {},
  embedOptions: {}
}

testPlayerMethods(YouTube, {
  play: 'playVideo',
  pause: 'pauseVideo',
  stop: 'stopVideo',
  seekTo: 'seekTo',
  setVolume: 'setVolume',
  mute: 'mute',
  unmute: 'unMute',
  getDuration: 'getDuration',
  getCurrentTime: 'getCurrentTime',
  getSecondsLoaded: 'getVideoLoadedFraction',
  setPlaybackRate: 'setPlaybackRate'
})

test('load()', t => {
  class Player {
    constructor (container, options) {
      t.true(container === 'mock-container')
      setTimeout(options.events.onReady, 100)
    }
  }
  const getSDK = sinon.stub(utils, 'getSDK').resolves({ Player })
  return new Promise(resolve => {
    const onReady = () => {
      t.pass()
      resolve()
    }
    const instance = shallow(
      <YouTube url={TEST_URL} config={TEST_CONFIG} onReady={onReady} />
    ).instance()
    instance.container = 'mock-container'
    instance.load(TEST_URL)
    t.true(getSDK.calledOnce)
    getSDK.restore()
  })
})

test('load() when ready', t => {
  const getSDK = sinon.stub(utils, 'getSDK').resolves()
  const instance = shallow(
    <YouTube url={TEST_URL} config={TEST_CONFIG} />
  ).instance()
  instance.player = { cueVideoById: sinon.fake() }
  instance.load(TEST_URL, true)
  t.true(instance.player.cueVideoById.calledOnceWith({
    videoId: 'oUFJJNQGwhk',
    startSeconds: undefined,
    endSeconds: undefined
  }))
  t.true(getSDK.notCalled)
  getSDK.restore()
})

test('onStateChange() - play', t => {
  const called = {}
  const onPlay = () => { called.onPlay = true }
  const onBufferEnd = () => { called.onBufferEnd = true }
  const instance = shallow(<YouTube url={TEST_URL} onPlay={onPlay} onBufferEnd={onBufferEnd} config={{}} />).instance()
  instance.onStateChange({ data: 'PLAYING' })
  t.true(called.onPlay && called.onBufferEnd)
})

test('onStateChange() - pause', async t => {
  const onPause = () => t.pass()
  const instance = shallow(<YouTube url={TEST_URL} onPause={onPause} config={{}} />).instance()
  instance.onStateChange({ data: 'PAUSED' })
})

test('onStateChange() - buffer', async t => {
  const onBuffer = () => t.pass()
  const instance = shallow(<YouTube url={TEST_URL} onBuffer={onBuffer} config={{}} />).instance()
  instance.onStateChange({ data: 'BUFFERING' })
})

test('onStateChange() - ended', async t => {
  const onEnded = () => t.pass()
  const instance = shallow(<YouTube url={TEST_URL} onEnded={onEnded} config={{}} />).instance()
  instance.player = { getPlaylist: () => {} }
  instance.onStateChange({ data: 'ENDED' })
})

test('onStateChange() - ready', async t => {
  const onReady = () => t.pass()
  const instance = shallow(<YouTube url={TEST_URL} onReady={onReady} config={{}} />).instance()
  instance.onStateChange({ data: 'CUED' })
})

test('render()', t => {
  const wrapper = shallow(<YouTube url={TEST_URL} />)
  const style = { width: '100%', height: '100%', display: undefined }
  t.true(wrapper.contains(
    <div style={style}>
      <div />
    </div>
  ))
})
