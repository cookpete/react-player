import React from 'react'
import test from 'ava'
import sinon from 'sinon'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import testPlayerMethods from '../helpers/testPlayerMethods'
import * as utils from '../../src/utils'
import Audius from '../../src/players/Audius'

configure({ adapter: new Adapter() })

const TEST_URL = 'https://audius.co/embed/track?id=5650&ownerId=294&flavor=card'
const TEST_CONFIG = {
  options: {}
}

testPlayerMethods(Audius, {
  play: 'togglePlay',
  pause: 'togglePlay',
  stop: null,
  seekTo: 'seekTo',
  setVolume: 'setVolume',
  mute: 'setVolume',
  unmute: 'setVolume'
})

test('load()', t => {
  const Embed = iframe => {
    t.true(iframe === 'mock-iframe')
    return {
      bind: () => null,
      getDuration: fn => fn(1000),
      load: (url, options) => options.callback()
    }
  }
  const Events = {
    PLAY: 'PLAY',
    PLAY_PROGRESS: 'PLAY_PROGRESS',
    PAUSE: 'PAUSE',
    FINISH: 'FINISH',
    ERROR: 'ERROR',
    READY: 'READY'
  }
  const AUD = { Embed, Events }
  const getSDK = sinon.stub(utils, 'getSDK').resolves(AUD)
  return new Promise(resolve => {
    const onReady = () => {
      t.pass()
      resolve()
    }
    const instance = shallow(<Audius onReady={onReady} config={TEST_CONFIG} />).instance()
    instance.iframe = 'mock-iframe'
    instance.load(TEST_URL)
    t.true(getSDK.calledOnce)
    getSDK.restore()
  })
})

test('getDuration()', t => {
  const instance = shallow(<Audius />).instance()
  instance.duration = 10
  t.true(instance.getDuration() === 10)
})

test('getCurrentTime()', t => {
  const instance = shallow(<Audius />).instance()
  instance.currentTime = 5
  t.true(instance.getCurrentTime() === 5)
})

test('getSecondsLoaded()', t => {
  const instance = shallow(<Audius />).instance()
  instance.duration = 10
  instance.fractionLoaded = 0.5
  t.true(instance.getSecondsLoaded() === 5)
})

test('render()', t => {
  const style = {
    width: '100%',
    height: '100%'
  }
  const wrapper = shallow(<Audius url={TEST_URL} />)
  t.true(wrapper.contains(
    <iframe
      src={TEST_URL}
      style={style}
      frameBorder={0}
      width='100%'
      allow='encrypted-media'
    />
  ))
})
