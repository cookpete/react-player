import { test } from 'zora'
import sinon from 'sinon'
import React from 'react'
import { create } from 'react-test-renderer'
import '../helpers/server-safe-globals'
import { testPlayerMethods } from '../helpers/helpers'
import { getSDK as originalGetSDK } from '../../src/utils'
import Wistia from '../../src/players/Wistia'

const TEST_URL = 'https://home.wistia.com/medias/e4a27b971d'
const TEST_CONFIG = {
  options: {}
}

Wistia.prototype.componentWillMount = function () {
  this.playerID = 'mock-player-id'
}

testPlayerMethods(Wistia, {
  play: 'play',
  pause: 'pause',
  // stop: 'remove',
  seekTo: 'time',
  setVolume: 'volume',
  mute: 'mute',
  unmute: 'unmute',
  getDuration: 'duration',
  getCurrentTime: 'time',
  getSecondsLoaded: null,
  setPlaybackRate: 'playbackRate'
}, { config: TEST_CONFIG })

test('load()', t => {
  const getSDK = sinon.stub(originalGetSDK, 'stub').resolves()
  return new Promise(resolve => {
    const onReady = () => {
      t.ok(true)
      resolve()
    }
    const instance = create(
      <Wistia url={TEST_URL} config={TEST_CONFIG} onReady={onReady} />
    ).getInstance()
    instance.load(TEST_URL)
    setTimeout(() => {
      t.ok(window._wq instanceof Array)
      t.ok(window._wq.length === 1)
      window._wq[0].onReady({
        bind: () => null,
        unbind: () => null
      })
    }, 100)
    t.ok(getSDK.calledOnce)
    getSDK.restore()
  })
})

test('render()', t => {
  const style = { width: '100%', height: '100%' }
  t.deepEqual(
    create(<Wistia url={TEST_URL} config={TEST_CONFIG} />).toJSON(),
    create(
      <div
        id='mock-player-id'
        key='e4a27b971d'
        style={style}
        className='wistia_embed wistia_async_e4a27b971d'
      />
    ).toJSON()
  )
})
