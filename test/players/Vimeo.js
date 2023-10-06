import { test } from 'zora'
import sinon from 'sinon'
import React from 'react'
import { create } from 'react-test-renderer'
import '../helpers/server-safe-globals'
import { testPlayerMethods } from '../helpers/helpers'
import { getSDK as originalGetSDK } from '../../src/utils'
import Vimeo from '../../src/players/Vimeo'

const TEST_URL = 'https://vimeo.com/90509568'
const TEST_CONFIG = {
  playerOptions: {}
}

testPlayerMethods(Vimeo, {
  play: 'play',
  pause: 'pause',
  stop: 'unload',
  seekTo: 'setCurrentTime',
  setVolume: 'setVolume',
  mute: 'setMuted',
  unmute: 'setMuted',
  getDuration: null,
  getCurrentTime: null,
  getSecondsLoaded: null
})

test('load()', t => {
  class Player {
    ready = () => Promise.resolve()
    getDuration = () => Promise.resolve()
    on = (event, fn) => {
      if (event === 'loaded') setTimeout(fn, 100)
    }
  }
  const getSDK = sinon.stub(originalGetSDK, 'stub').resolves({ Player })
  return new Promise(resolve => {
    const onReady = () => {
      t.ok(true)
      resolve()
    }
    const instance = create(
      <Vimeo url={TEST_URL} config={TEST_CONFIG} onReady={onReady} />
    ).getInstance()
    instance.container = {
      querySelector: () => ({ style: {} })
    }
    instance.load(TEST_URL)
    t.ok(getSDK.calledOnce)
    getSDK.restore()
  })
})

test('render()', t => {
  const style = {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    display: undefined
  }
  t.deepEqual(
    create(<Vimeo url={TEST_URL} />).toJSON(),
    create(
      <div key={TEST_URL} style={style} />
    ).toJSON()
  )
})
