import React from 'react'
import test from 'ava'
import sinon from 'sinon'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import testPlayerMethods from '../helpers/testPlayerMethods'
import * as utils from '../../src/utils'
import Streamable from '../../src/players/Streamable'

configure({ adapter: new Adapter() })

const TEST_URL = 'https://streamable.com/moo'
const TEST_CONFIG = {
  options: {}
}

testPlayerMethods(Streamable, {
  play: 'play',
  pause: 'pause',
  stop: null,
  seekTo: 'setCurrentTime',
  setVolume: 'setVolume',
  mute: 'mute',
  unmute: 'unmute'
}, { url: 'https://streamable.com/moo' })

test('load()', t => {
  class Player {
    constructor (iframe) {
      t.true(iframe === 'mock-iframe')
    }

    on = (event, fn) => {
      if (event === 'ready') setTimeout(fn, 100)
    }

    setLoop = () => null
  }
  const getSDK = sinon.stub(utils, 'getSDK').resolves({ Player })
  return new Promise(resolve => {
    const onReady = () => {
      t.pass()
      resolve()
    }
    const instance = shallow(
      <Streamable url={TEST_URL} onReady={onReady} config={TEST_CONFIG} />
    ).instance()
    instance.iframe = 'mock-iframe'
    instance.load(TEST_URL)
    t.true(getSDK.calledOnce)
    getSDK.restore()
  })
})

test('getDuration()', t => {
  const instance = shallow(<Streamable url={TEST_URL} />).instance()
  instance.duration = 10
  t.true(instance.getDuration() === 10)
})

test('getCurrentTime()', t => {
  const instance = shallow(<Streamable url={TEST_URL} />).instance()
  instance.currentTime = 5
  t.true(instance.getCurrentTime() === 5)
})

test('getSecondsLoaded()', t => {
  const instance = shallow(<Streamable url={TEST_URL} />).instance()
  instance.secondsLoaded = 5
  t.true(instance.getSecondsLoaded() === 5)
})

test('render()', t => {
  const style = { width: '100%', height: '100%' }
  const wrapper = shallow(<Streamable url={TEST_URL} />)
  t.true(wrapper.contains(
    <iframe
      src='https://streamable.com/o/moo'
      frameBorder='0'
      scrolling='no'
      style={style}
      allowFullScreen
    />
  ))
})
