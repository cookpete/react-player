
import React from 'react'
import test from 'ava'
import sinon from 'sinon'
import { shallow } from 'enzyme'
import testPlayerMethods from '../helpers/testPlayerMethods'
import * as utils from '../../src/utils'
import Spotify from '../../src/players/Spotify'

global.window = {}
const TEST_URL = 'spotify:track:0KhB428j00T8lxKCpHweKw'

testPlayerMethods(Spotify, {
  play: 'resume',
  pause: 'pause',
  stop: 'destroy',
  seekTo: 'seek'
})

test('load() - Player not initialized and sdk not loaded', t => {
  class MockPlayer {
    constructor (container, options) {
      t.true(container === 'mock-container')
      setTimeout(options.events.onReady, 100)
    }
  }
  const getSDK = sinon.stub(utils, 'getSDK').resolves({ MockPlayer })

  const instance = shallow(
    <Spotify url={TEST_URL} />
  ).instance()
  instance.container = 'mock-container'
  instance.load(TEST_URL)
  t.truthy(global.window.onSpotifyIframeApiReady)
  t.true(getSDK.calledOnce)
  getSDK.restore()
})

test('load() - sdk already loaded', t => {
  const getSDK = sinon.stub(utils, 'getSDK')
  window.SpotifyIframeApi = true

  const instance = shallow(
    <Spotify url={TEST_URL} />
  ).instance()
  const initializePlayer = sinon.stub(instance, 'initializePlayer')
  instance.container = 'mock-container'
  instance.load(TEST_URL)
  t.false(getSDK.calledOnce)
  t.true(initializePlayer.calledOnce)
  getSDK.restore()
  initializePlayer.restore()
})

test('load() - player already initialized', t => {
  const getSDK = sinon.stub(utils, 'getSDK')
  window.SpotifyIframeApi = true

  const instance = shallow(
    <Spotify url={TEST_URL} />
  ).instance()
  instance.player = true
  const initializePlayer = sinon.stub(instance, 'initializePlayer')
  const callPlayer = sinon.stub(instance, 'callPlayer')
  instance.container = 'mock-container'

  instance.load(TEST_URL)
  t.false(getSDK.calledOnce)
  t.false(initializePlayer.calledOnce)
  t.true(callPlayer.calledOnce)
  getSDK.restore()
  initializePlayer.restore()
  callPlayer.restore()
})

test('onStateChange() - play', t => {
  const called = {}
  const onPlay = () => { called.onPlay = true }
  const onBufferEnd = () => { called.onBufferEnd = true }
  const instance = shallow(<Spotify url={TEST_URL} onPlay={onPlay} onBufferEnd={onBufferEnd} />).instance()
  instance.onStateChange({ data: { isPaused: false, isBuffering: false } })
  t.true(called.onPlay && called.onBufferEnd)
})

test('onStateChange() - pause', async t => {
  const onPause = () => t.pass()
  const instance = shallow(<Spotify url={TEST_URL} onPause={onPause} />).instance()
  instance.onStateChange({ data: { isPaused: true } })
})

test('onStateChange() - buffer', async t => {
  const onBuffer = () => t.pass()
  const instance = shallow(<Spotify url={TEST_URL} onBuffer={onBuffer} />).instance()
  instance.onStateChange({ data: { isBuffering: true } })
})

test('onStateChange() - ended', async t => {
  const onEnded = () => t.pass()
  const instance = shallow(<Spotify url={TEST_URL} onEnded={onEnded} onPlay={() => {}} onBufferEnd={() => {}} />).instance()
  instance.onStateChange({ data: { duration: 100, position: 105, isPaused: false, isBuffering: false } })
})

test('render()', t => {
  const wrapper = shallow(<Spotify url={TEST_URL} />)
  const style = { width: '100%', height: '100%' }
  t.true(wrapper.contains(
    <div style={style}>
      <div />
    </div>
  ))
})