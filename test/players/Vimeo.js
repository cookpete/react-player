import React from 'react'
import test from 'ava'
import sinon from 'sinon'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import testPlayerMethods from '../helpers/testPlayerMethods'
import * as utils from '../../src/utils'
import Vimeo from '../../src/players/Vimeo'

configure({ adapter: new Adapter() })

const TEST_URL = 'https://vimeo.com/90509568'
const TEST_CONFIG = {
  playerOptions: {}
}

testPlayerMethods(Vimeo, {
  play: 'play',
  pause: 'pause',
  stop: 'unload',
  seekTo: 'setCurrentTime',
  setVolume: 'setVolume',
  mute: 'setVolume',
  unmute: 'setVolume',
  getDuration: null,
  getCurrentTime: null,
  getSecondsLoaded: null
})

test('load()', t => {
  class Player {
    ready = () => Promise.resolve()
    getDuration = () => Promise.resolve()
    on = (event, fn) => {
      if (event === 'loaded') setTimeout(fn, 100)
    }
  }
  const getSDK = sinon.stub(utils, 'getSDK').resolves({ Player })
  return new Promise(resolve => {
    const onReady = () => {
      t.pass()
      resolve()
    }
    const instance = shallow(
      <Vimeo url={TEST_URL} config={TEST_CONFIG} onReady={onReady} />
    ).instance()
    instance.container = {
      querySelector: () => ({ style: {} })
    }
    instance.load(TEST_URL)
    t.true(getSDK.calledOnce)
    getSDK.restore()
  })
})

test('render()', t => {
  const wrapper = shallow(<Vimeo url={TEST_URL} />)
  const style = {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    display: undefined
  }
  t.true(wrapper.contains(
    <div key={TEST_URL} style={style} />
  ))
})
