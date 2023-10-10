import { test } from 'zora'
import sinon from 'sinon'
import React from 'react'
import { create } from 'react-test-renderer'
import '../helpers/server-safe-globals'
import { testPlayerMethods } from '../helpers/helpers'
import { getSDK as originalGetSDK } from '../../src/utils'
import DailyMotion from '../../src/players/DailyMotion'

const TEST_URL = 'https://www.dailymotion.com/video/x5e9eog'
const TEST_CONFIG = {
  params: {}
}

testPlayerMethods(DailyMotion, {
  play: 'play',
  pause: 'pause',
  stop: null,
  seekTo: 'seek',
  setVolume: 'setVolume',
  mute: 'setMuted',
  unmute: 'setMuted'
})

test('load()', async t => {
  class MockPlayer {
    constructor (container, options) {
      t.equal(container, 'abc')
      t.equal(options.video, 'x5e9eog')
    }
  }
  const getSDK = sinon.stub(originalGetSDK, 'stub').resolves({ player: MockPlayer })
  const instance = create(<DailyMotion config={TEST_CONFIG} />).getInstance()
  instance.load(TEST_URL)
  instance.ref('abc')
  t.ok(getSDK.calledOnce)
  getSDK.restore()
})

test('load() - no container', async t => {
  class MockPlayer {
    constructor (container, options) {
      t.fail('Player constructor was called')
    }
  }
  const getSDK = sinon.stub(originalGetSDK, 'stub').resolves({ player: MockPlayer })
  const instance = create(<DailyMotion config={TEST_CONFIG} />).getInstance()
  instance.load(TEST_URL)
  t.ok(getSDK.calledOnce)
  getSDK.restore()
})

test('load() - existing player', t => {
  const instance = create(<DailyMotion config={TEST_CONFIG} />).getInstance()
  instance.player = { load: sinon.fake() }
  instance.load(TEST_URL)
  t.ok(instance.player.load.calledOnceWith('x5e9eog'))
})

test('onDurationChange()', t => {
  const onDuration = duration => {
    t.ok(duration === 10)
  }
  const instance = create(<DailyMotion config={TEST_CONFIG} onDuration={onDuration} />).getInstance()
  instance.player = { duration: 10 }
  instance.onDurationChange()
})

test('getDuration()', t => {
  const instance = create(<DailyMotion config={TEST_CONFIG} />).getInstance()
  instance.player = { duration: 10 }
  t.ok(instance.getDuration() === 10)
})

test('getCurrentTime()', t => {
  const instance = create(<DailyMotion config={TEST_CONFIG} />).getInstance()
  instance.player = { currentTime: 5 }
  t.ok(instance.getCurrentTime() === 5)
})

test('getSecondsLoaded()', t => {
  const instance = create(<DailyMotion config={TEST_CONFIG} />).getInstance()
  instance.player = { bufferedTime: 5 }
  t.ok(instance.getSecondsLoaded() === 5)
})

test('render()', t => {
  const style = {
    width: '100%',
    height: '100%',
    display: undefined
  }
  t.deepEqual(
    create(<DailyMotion config={TEST_CONFIG} />).toJSON(),
    create(
      <div style={style}>
        <div />
      </div>
    ).toJSON()
  )
})
