import React from 'react'
import test from 'ava'
import sinon from 'sinon'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import testPlayerMethods from '../helpers/testPlayerMethods'
import * as utils from '../../src/utils'
import SoundCloud from '../../src/players/SoundCloud'

configure({ adapter: new Adapter() })

const TEST_URL = 'https://soundcloud.com/miami-nights-1984/accelerated'
const TEST_CONFIG = {
  options: {}
}

testPlayerMethods(SoundCloud, {
  play: 'play',
  pause: 'pause',
  stop: null,
  seekTo: 'seekTo',
  setVolume: 'setVolume',
  mute: 'setVolume',
  unmute: 'setVolume'
})

test('load()', t => {
  const Widget = iframe => {
    t.true(iframe === 'mock-iframe')
    return {
      bind: () => null,
      getDuration: fn => fn(1000),
      load: (url, options) => options.callback()
    }
  }
  Widget.Events = {
    PLAY: 'PLAY',
    PLAY_PROGRESS: 'PLAY_PROGRESS',
    PAUSE: 'PAUSE',
    FINISH: 'FINISH',
    ERROR: 'ERROR'
  }
  const SC = { Widget }
  const getSDK = sinon.stub(utils, 'getSDK').resolves(SC)
  return new Promise(resolve => {
    const onReady = () => {
      t.pass()
      resolve()
    }
    const instance = shallow(<SoundCloud onReady={onReady} config={TEST_CONFIG} />).instance()
    instance.iframe = 'mock-iframe'
    instance.load(TEST_URL)
    t.true(getSDK.calledOnce)
    getSDK.restore()
  })
})

test('getDuration()', t => {
  const instance = shallow(<SoundCloud />).instance()
  instance.duration = 10
  t.true(instance.getDuration() === 10)
})

test('getCurrentTime()', t => {
  const instance = shallow(<SoundCloud />).instance()
  instance.currentTime = 5
  t.true(instance.getCurrentTime() === 5)
})

test('getSecondsLoaded()', t => {
  const instance = shallow(<SoundCloud />).instance()
  instance.duration = 10
  instance.fractionLoaded = 0.5
  t.true(instance.getSecondsLoaded() === 5)
})

test('render()', t => {
  const style = {
    width: '100%',
    height: '100%',
    display: undefined
  }
  const wrapper = shallow(<SoundCloud url={TEST_URL} />)
  t.true(wrapper.contains(
    <iframe
      src='https://w.soundcloud.com/player/?url=https%3A%2F%2Fsoundcloud.com%2Fmiami-nights-1984%2Faccelerated'
      style={style}
      frameBorder={0}
      allow='autoplay'
    />
  ))
})
