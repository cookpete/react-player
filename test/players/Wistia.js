import React from 'react'
import test from 'ava'
import sinon from 'sinon'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import testPlayerMethods from '../helpers/testPlayerMethods'
import * as utils from '../../src/utils'
import Wistia from '../../src/players/Wistia'

global.window = {}

configure({ adapter: new Adapter() })

const TEST_URL = 'https://home.wistia.com/medias/e4a27b971d'
const TEST_CONFIG = {
  options: {}
}

Wistia.prototype.componentWillMount = function () {
  this.playerID = 'mock-player-id'
}

testPlayerMethods(Wistia, {
  play: 'play',
  pause: 'pause',
  // stop: 'remove',
  seekTo: 'time',
  setVolume: 'volume',
  mute: 'mute',
  unmute: 'unmute',
  getDuration: 'duration',
  getCurrentTime: 'time',
  getSecondsLoaded: null,
  setPlaybackRate: 'playbackRate'
}, { config: TEST_CONFIG })

test('load()', t => {
  const getSDK = sinon.stub(utils, 'getSDK').resolves()
  return new Promise(resolve => {
    const onReady = () => {
      t.pass()
      resolve()
    }
    const instance = shallow(
      <Wistia url={TEST_URL} config={TEST_CONFIG} onReady={onReady} />
    ).instance()
    instance.load(TEST_URL)
    setTimeout(() => {
      t.true(window._wq instanceof Array)
      t.true(window._wq.length === 1)
      window._wq[0].onReady({
        bind: () => null,
        unbind: () => null
      })
    }, 100)
    t.true(getSDK.calledOnce)
    getSDK.restore()
  })
})

test('render()', t => {
  const wrapper = shallow(<Wistia url={TEST_URL} config={TEST_CONFIG} />)
  const style = { width: '100%', height: '100%' }
  t.true(wrapper.contains(
    <div
      id='mock-player-id'
      key='e4a27b971d'
      style={style}
      className='wistia_embed wistia_async_e4a27b971d'
    />
  ))
})
