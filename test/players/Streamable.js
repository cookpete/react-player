import { test } from 'zora'
import sinon from 'sinon'
import React from 'react'
import { create } from 'react-test-renderer'
import '../helpers/server-safe-globals'
import { testPlayerMethods } from '../helpers/helpers'
import { getSDK as originalGetSDK } from '../../src/utils'
import Streamable from '../../src/players/Streamable'

const TEST_URL = 'https://streamable.com/moo'
const TEST_CONFIG = {
  options: {}
}

testPlayerMethods(Streamable, {
  play: 'play',
  pause: 'pause',
  stop: null,
  seekTo: 'setCurrentTime',
  setVolume: 'setVolume',
  mute: 'mute',
  unmute: 'unmute'
}, { url: 'https://streamable.com/moo' })

test('load()', t => {
  class Player {
    constructor (iframe) {
      t.ok(iframe === 'mock-iframe')
    }

    on = (event, fn) => {
      if (event === 'ready') setTimeout(fn, 100)
    }

    setLoop = () => null
  }
  const getSDK = sinon.stub(originalGetSDK, 'stub').resolves({ Player })
  return new Promise(resolve => {
    const onReady = () => {
      t.ok(true)
      resolve()
    }
    const instance = create(
      <Streamable url={TEST_URL} onReady={onReady} config={TEST_CONFIG} />
    ).getInstance()
    instance.iframe = 'mock-iframe'
    instance.load(TEST_URL)
    t.ok(getSDK.calledOnce)
    getSDK.restore()
  })
})

test('getDuration()', t => {
  const instance = create(<Streamable url={TEST_URL} />).getInstance()
  instance.duration = 10
  t.ok(instance.getDuration() === 10)
})

test('getCurrentTime()', t => {
  const instance = create(<Streamable url={TEST_URL} />).getInstance()
  instance.currentTime = 5
  t.ok(instance.getCurrentTime() === 5)
})

test('getSecondsLoaded()', t => {
  const instance = create(<Streamable url={TEST_URL} />).getInstance()
  instance.secondsLoaded = 5
  t.ok(instance.getSecondsLoaded() === 5)
})

test('render()', t => {
  const style = { width: '100%', height: '100%' }
  t.deepEqual(
    create(<Streamable url={TEST_URL} />).toJSON(),
    create(
      <iframe
        src='https://streamable.com/o/moo'
        frameBorder='0'
        scrolling='no'
        style={style}
        allow='encrypted-media; autoplay; fullscreen;'
      />
    ).toJSON()
  )
})
