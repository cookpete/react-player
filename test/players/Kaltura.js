import { test } from 'zora'
import sinon from 'sinon'
import React from 'react'
import { create } from 'react-test-renderer'
import '../helpers/server-safe-globals'
import { testPlayerMethods } from '../helpers/helpers'
import { getSDK as originalGetSDK } from '../../src/utils'
import Kaltura from '../../src/players/Kaltura'

const TEST_URL = 'https://cdnapisec.kaltura.com/p/2507381/sp/250738100/embedIframeJs/uiconf_id/44372392/partner_id/2507381?iframeembed=true&playerId=kaltura_player_1605622336&entry_id=1_i1jmzcn3'
const TEST_CONFIG = {
  options: {}
}

testPlayerMethods(Kaltura, {
  play: 'play',
  pause: 'pause',
  stop: null,
  seekTo: 'setCurrentTime',
  setVolume: 'setVolume',
  mute: 'mute',
  unmute: 'unmute'
}, { url: TEST_URL })

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
      <Kaltura url={TEST_URL} onReady={onReady} config={TEST_CONFIG} />
    ).getInstance()
    instance.iframe = 'mock-iframe'
    instance.load(TEST_URL)
    t.ok(getSDK.calledOnce)
    getSDK.restore()
  })
})

test('getDuration()', t => {
  const instance = create(<Kaltura url={TEST_URL} />).getInstance()
  instance.duration = 10
  t.ok(instance.getDuration() === 10)
})

test('getCurrentTime()', t => {
  const instance = create(<Kaltura url={TEST_URL} />).getInstance()
  instance.currentTime = 5
  t.ok(instance.getCurrentTime() === 5)
})

test('getSecondsLoaded()', t => {
  const instance = create(<Kaltura url={TEST_URL} />).getInstance()
  instance.secondsLoaded = 5
  t.ok(instance.getSecondsLoaded() === 5)
})

test('render()', t => {
  const style = { width: '100%', height: '100%' }
  t.deepEqual(
    create(<Kaltura url={TEST_URL} />).toJSON(),
    create(<iframe
      src={TEST_URL}
      frameBorder='0'
      scrolling='no'
      style={style}
      allow='encrypted-media; autoplay; fullscreen;'
      referrerPolicy='no-referrer-when-downgrade'
           />).toJSON()
  )
})
