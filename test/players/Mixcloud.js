import { test } from 'zora'
import sinon from 'sinon'
import React from 'react'
import { create } from 'react-test-renderer'
import '../helpers/server-safe-globals'
import { testPlayerMethods } from '../helpers/helpers'
import { getSDK as originalGetSDK } from '../../src/utils'
import Mixcloud from '../../src/players/Mixcloud'

const TEST_URL = 'https://www.mixcloud.com/mixcloud/meet-the-curators'
const TEST_CONFIG = {
  options: {}
}

testPlayerMethods(Mixcloud, {
  play: 'play',
  pause: 'pause',
  stop: null,
  seekTo: 'seek',
  setVolume: null,
  mute: null,
  unmute: null,
  getSecondsLoaded: null
}, {
  url: 'https://www.mixcloud.com/mixcloud/meet-the-curators',
  config: { mixcloud: { options: {} } }
})

test('load()', async t => {
  const MixcloudSDK = {
    PlayerWidget: () => ({
      ready: Promise.resolve(),
      events: {
        play: { on: () => null },
        pause: { on: () => null },
        ended: { on: () => null },
        error: { on: () => null },
        progress: { on: () => null }
      }
    })
  }
  const getSDK = sinon.stub(originalGetSDK, 'stub').resolves(MixcloudSDK)
  const onReady = () => t.ok(true)
  const instance = create(
    <Mixcloud url={TEST_URL} config={TEST_CONFIG} onReady={onReady} />
  ).getInstance()
  instance.load(TEST_URL)
  t.ok(getSDK.calledOnce)
  getSDK.restore()
})

test('getDuration()', t => {
  const instance = create(<Mixcloud url={TEST_URL} config={TEST_CONFIG} />).getInstance()
  instance.duration = 10
  t.ok(instance.getDuration() === 10)
})

test('getCurrentTime()', t => {
  const instance = create(<Mixcloud url={TEST_URL} config={TEST_CONFIG} />).getInstance()
  instance.currentTime = 5
  t.ok(instance.getCurrentTime() === 5)
})

test('render()', t => {
  const style = { width: '100%', height: '100%' }
  t.deepEqual(
    create(<Mixcloud url={TEST_URL} config={TEST_CONFIG} />).toJSON(),
    create(
      <iframe
        style={style}
        src='https://player-widget.mixcloud.com/widget/iframe/?feed=/mixcloud/meet-the-curators/'
        frameBorder='0'
        allow='autoplay'
      />
    ).toJSON()
  )
})
