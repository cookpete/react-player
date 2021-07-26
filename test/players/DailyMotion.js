import React from 'react'
import test from 'ava'
import sinon from 'sinon'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import testPlayerMethods from '../helpers/testPlayerMethods'
import * as utils from '../../src/utils'
import DailyMotion from '../../src/players/DailyMotion'

global.window = {
  location: { origin: 'origin' }
}

configure({ adapter: new Adapter() })

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
      t.true(container === 'abc')
      t.true(options.video === 'x5e9eog')
      t.pass()
    }
  }
  const getSDK = sinon.stub(utils, 'getSDK').resolves({ player: MockPlayer })
  const instance = shallow(<DailyMotion config={TEST_CONFIG} />).instance()
  instance.load(TEST_URL)
  instance.ref('abc')
  t.true(getSDK.calledOnce)
  getSDK.restore()
})

test('load() - no container', async t => {
  class MockPlayer {
    constructor (container, options) {
      t.fail('Player constructor was called')
    }
  }
  const getSDK = sinon.stub(utils, 'getSDK').resolves({ player: MockPlayer })
  const instance = shallow(<DailyMotion config={TEST_CONFIG} />).instance()
  instance.load(TEST_URL)
  t.true(getSDK.calledOnce)
  getSDK.restore()
})

test('load() - existing player', t => {
  const instance = shallow(<DailyMotion config={TEST_CONFIG} />).instance()
  instance.player = { load: sinon.fake() }
  instance.load(TEST_URL)
  t.true(instance.player.load.calledOnceWith('x5e9eog'))
})

test('onDurationChange()', t => {
  const onDuration = duration => {
    t.true(duration === 10)
  }
  const instance = shallow(<DailyMotion config={TEST_CONFIG} onDuration={onDuration} />).instance()
  instance.player = { duration: 10 }
  instance.onDurationChange()
})

test('getDuration()', t => {
  const instance = shallow(<DailyMotion config={TEST_CONFIG} />).instance()
  instance.player = { duration: 10 }
  t.true(instance.getDuration() === 10)
})

test('getCurrentTime()', t => {
  const instance = shallow(<DailyMotion config={TEST_CONFIG} />).instance()
  instance.player = { currentTime: 5 }
  t.true(instance.getCurrentTime() === 5)
})

test('getSecondsLoaded()', t => {
  const instance = shallow(<DailyMotion config={TEST_CONFIG} />).instance()
  instance.player = { bufferedTime: 5 }
  t.true(instance.getSecondsLoaded() === 5)
})

test('render()', t => {
  const style = {
    width: '100%',
    height: '100%',
    display: undefined
  }
  const wrapper = shallow(<DailyMotion config={TEST_CONFIG} />)
  t.true(wrapper.contains(
    <div style={style}>
      <div />
    </div>
  ))
})
