import { test } from 'zora'
import sinon from 'sinon'
import React from 'react'
import { create } from 'react-test-renderer'
import '../helpers/server-safe-globals'
import { testPlayerMethods } from '../helpers/helpers'
import { getSDK as originalGetSDK } from '../../src/utils'
import Facebook from '../../src/players/Facebook'

const TEST_URL = 'https://www.facebook.com/facebook/videos/10153231379946729'
const TEST_CONFIG = {
  appId: '123'
}

Facebook.prototype.componentWillMount = function () {
  this.playerID = 'mock-player-id'
}

testPlayerMethods(Facebook, {
  play: 'play',
  pause: 'pause',
  stop: null,
  seekTo: 'seek',
  setVolume: 'setVolume',
  mute: 'mute',
  unmute: 'unmute',
  getDuration: 'getDuration',
  getCurrentTime: 'getCurrentPosition',
  getSecondsLoaded: null
}, { config: TEST_CONFIG })

test('load()', async t => {
  const FB = {
    init: () => null,
    Event: {
      subscribe: (event, fn) => {
        if (event === 'xfbml.ready') {
          fn({
            type: 'video',
            id: 'mock-player-id',
            instance: {
              subscribe: () => null,
              unmute: () => null
            }
          })
        }
      }
    }
  }
  const getSDK = sinon.stub(originalGetSDK, 'stub').resolves(FB)
  const onReady = () => t.ok(true)
  const instance = create(<Facebook config={TEST_CONFIG} onReady={onReady} />).getInstance()
  instance.load(TEST_URL)
  t.ok(getSDK.calledOnce)
  getSDK.restore()
})

test('load() when ready', async t => {
  const FB = {
    XFBML: {
      parse: () => t.ok(true)
    }
  }
  const getSDK = sinon.stub(originalGetSDK, 'stub').resolves(FB)
  const onReady = () => t.ok(true)
  const instance = create(<Facebook config={TEST_CONFIG} onReady={onReady} />).getInstance()
  instance.load(TEST_URL, true)
  t.ok(getSDK.calledOnce)
  getSDK.restore()
})

test('render()', t => {
  const style = {
    width: '100%',
    height: '100%'
  }
  t.deepEqual(
    create(<Facebook url={TEST_URL} config={TEST_CONFIG} />).toJSON(),
    create(
      <div
        style={style}
        id='mock-player-id'
        className='fb-video'
        data-href={TEST_URL}
        data-autoplay='false'
        data-allowfullscreen='true'
        data-controls='false'
      />
    ).toJSON()
  )
})
