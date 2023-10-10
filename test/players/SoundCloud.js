import { test } from 'zora'
import sinon from 'sinon'
import React from 'react'
import { create } from 'react-test-renderer'
import '../helpers/server-safe-globals'
import { testPlayerMethods } from '../helpers/helpers'
import { getSDK as originalGetSDK } from '../../src/utils'
import SoundCloud from '../../src/players/SoundCloud'

const TEST_URL = 'https://soundcloud.com/miami-nights-1984/accelerated'
const TEST_CONFIG = {
  options: {}
}

testPlayerMethods(SoundCloud, {
  play: 'play',
  pause: 'pause',
  stop: null,
  seekTo: 'seekTo',
  setVolume: 'setVolume',
  mute: 'setVolume',
  unmute: 'setVolume'
})

test('load()', t => {
  const Widget = iframe => {
    t.ok(iframe === 'mock-iframe')
    return {
      bind: () => null,
      getDuration: fn => fn(1000),
      load: (url, options) => options.callback()
    }
  }
  Widget.Events = {
    PLAY: 'PLAY',
    PLAY_PROGRESS: 'PLAY_PROGRESS',
    PAUSE: 'PAUSE',
    FINISH: 'FINISH',
    ERROR: 'ERROR'
  }
  const SC = { Widget }
  const getSDK = sinon.stub(originalGetSDK, 'stub').resolves(SC)
  return new Promise(resolve => {
    const onReady = () => {
      t.ok(true)
      resolve()
    }
    const instance = create(<SoundCloud onReady={onReady} config={TEST_CONFIG} />).getInstance()
    instance.iframe = 'mock-iframe'
    instance.load(TEST_URL)
    t.ok(getSDK.calledOnce)
    getSDK.restore()
  })
})

test('getDuration()', t => {
  const instance = create(<SoundCloud />).getInstance()
  instance.duration = 10
  t.ok(instance.getDuration() === 10)
})

test('getCurrentTime()', t => {
  const instance = create(<SoundCloud />).getInstance()
  instance.currentTime = 5
  t.ok(instance.getCurrentTime() === 5)
})

test('getSecondsLoaded()', t => {
  const instance = create(<SoundCloud />).getInstance()
  instance.duration = 10
  instance.fractionLoaded = 0.5
  t.ok(instance.getSecondsLoaded() === 5)
})

test('render()', t => {
  const style = {
    width: '100%',
    height: '100%',
    display: undefined
  }
  t.deepEqual(
    create(<SoundCloud url={TEST_URL} />).toJSON(),
    create(
      <iframe
        src='https://w.soundcloud.com/player/?url=https%3A%2F%2Fsoundcloud.com%2Fmiami-nights-1984%2Faccelerated'
        style={style}
        frameBorder={0}
        allow='autoplay'
      />
    ).toJSON()
  )
})
