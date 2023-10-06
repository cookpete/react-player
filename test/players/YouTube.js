import { test } from 'zora'
import sinon from 'sinon'
import React from 'react'
import { create } from 'react-test-renderer'
import '../helpers/server-safe-globals'
import { testPlayerMethods } from '../helpers/helpers'
import { getSDK as originalGetSDK } from '../../src/utils'
import YouTube from '../../src/players/YouTube'

Object.assign(globalThis.window, {
  YT: {
    PlayerState: {
      PLAYING: 'PLAYING',
      PAUSED: 'PAUSED',
      BUFFERING: 'BUFFERING',
      ENDED: 'ENDED',
      CUED: 'CUED'
    }
  }
})

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
      t.ok(container === 'mock-container')
      setTimeout(options.events.onReady, 100)
    }
  }
  const getSDK = sinon.stub(originalGetSDK, 'stub').resolves({ Player })
  return new Promise(resolve => {
    const onReady = () => {
      t.ok(true)
      resolve()
    }
    const instance = create(
      <YouTube url={TEST_URL} config={TEST_CONFIG} onReady={onReady} />
    ).getInstance()
    instance.container = 'mock-container'
    instance.load(TEST_URL)
    t.ok(getSDK.calledOnce)
    getSDK.restore()
  })
})

test('load() when ready', t => {
  const getSDK = sinon.stub(originalGetSDK, 'stub').resolves()
  const instance = create(
    <YouTube url={TEST_URL} config={TEST_CONFIG} />
  ).getInstance()
  instance.player = { cueVideoById: sinon.fake() }
  instance.load(TEST_URL, true)
  t.ok(instance.player.cueVideoById.calledOnceWith({
    videoId: 'oUFJJNQGwhk',
    startSeconds: undefined,
    endSeconds: undefined
  }))
  t.ok(getSDK.notCalled)
  getSDK.restore()
})

test('onStateChange() - play', t => {
  const called = {}
  const onPlay = () => { called.onPlay = true }
  const onBufferEnd = () => { called.onBufferEnd = true }
  const instance = create(<YouTube url={TEST_URL} onPlay={onPlay} onBufferEnd={onBufferEnd} config={{}} />).getInstance()
  instance.onStateChange({ data: 'PLAYING' })
  t.ok(called.onPlay && called.onBufferEnd)
})

test('onStateChange() - pause', async t => {
  const onPause = () => t.ok(true)
  const instance = create(<YouTube url={TEST_URL} onPause={onPause} config={{}} />).getInstance()
  instance.onStateChange({ data: 'PAUSED' })
})

test('onStateChange() - buffer', async t => {
  const onBuffer = () => t.ok(true)
  const instance = create(<YouTube url={TEST_URL} onBuffer={onBuffer} config={{}} />).getInstance()
  instance.onStateChange({ data: 'BUFFERING' })
})

test('onStateChange() - ended', async t => {
  const onEnded = () => t.ok(true)
  const instance = create(<YouTube url={TEST_URL} onEnded={onEnded} config={{}} />).getInstance()
  instance.player = { getPlaylist: () => {} }
  instance.onStateChange({ data: 'ENDED' })
})

test('onStateChange() - ready', async t => {
  const onReady = () => t.ok(true)
  const instance = create(<YouTube url={TEST_URL} onReady={onReady} config={{}} />).getInstance()
  instance.onStateChange({ data: 'CUED' })
})

test('render()', t => {
  const style = { width: '100%', height: '100%', display: undefined }
  t.deepEqual(
    create(<YouTube url={TEST_URL} />).toJSON(),
    create(
      <div style={style}>
        <div />
      </div>
    ).toJSON()
  )
})
