import React from 'react'
import test from 'ava'
import sinon from 'sinon'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import testPlayerMethods from '../helpers/testPlayerMethods'
import * as utils from '../../src/utils'
import Mixcloud from '../../src/players/Mixcloud'

configure({ adapter: new Adapter() })

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
  const getSDK = sinon.stub(utils, 'getSDK').resolves(MixcloudSDK)
  const onReady = () => t.pass()
  const instance = shallow(
    <Mixcloud url={TEST_URL} config={TEST_CONFIG} onReady={onReady} />
  ).instance()
  instance.load(TEST_URL)
  t.true(getSDK.calledOnce)
  getSDK.restore()
})

test('getDuration()', t => {
  const instance = shallow(<Mixcloud url={TEST_URL} config={TEST_CONFIG} />).instance()
  instance.duration = 10
  t.true(instance.getDuration() === 10)
})

test('getCurrentTime()', t => {
  const instance = shallow(<Mixcloud url={TEST_URL} config={TEST_CONFIG} />).instance()
  instance.currentTime = 5
  t.true(instance.getCurrentTime() === 5)
})

test('render()', t => {
  const style = { width: '100%', height: '100%' }
  const wrapper = shallow(<Mixcloud url={TEST_URL} config={TEST_CONFIG} />)
  t.true(wrapper.contains(
    <iframe
      style={style}
      src='https://www.mixcloud.com/widget/iframe/?feed=/mixcloud/meet-the-curators/'
      frameBorder='0'
    />
  ))
})
