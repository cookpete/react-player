import React from 'react'
import test from 'ava'
import sinon from 'sinon'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import testPlayerMethods from '../helpers/testPlayerMethods'
import * as utils from '../../src/utils'
import { Tencent } from '../../src/players/Tencent'

configure({ adapter: new Adapter() })

const TEST_URL = 'https://v.qq.com/x/page/b0919nc8tex.html'
const TEST_CONFIG = {
  tencent: {
    options: {}
  }
}

Tencent.prototype.componentWillMount = function () {
  this.playerID = 'mock-player-id'
}

testPlayerMethods(Tencent, {
  play: 'play',
  pause: 'pause',
  stop: null,
  seekTo: 'seekTo',
  setVolume: 'setVolume',
  mute: 'mute',
  unmute: 'unMute',
  getDuration: 'getDuration',
  getCurrentTime: 'getCurrentTime',
  getSecondsLoaded: null
})

test('load()', t => {
  class Txplayer {
    constructor (options) {
      t.true(options.containerId === 'mock-player-id')
    }

    on = (event, fn) => {
      if (event === 'ready') setTimeout(fn, 100)
    }

    setLoop = () => null
  }
  const getSDK = sinon.stub(utils, 'getSDK').resolves({ Txplayer })
  return new Promise(resolve => {
    const onReady = () => {
      t.pass()
      resolve()
    }
    const instance = shallow(
      <Tencent url={TEST_URL} onReady={onReady} config={TEST_CONFIG} />
    ).instance()
    instance.load(TEST_URL)
    t.true(getSDK.calledOnce)
    getSDK.restore()
  })
})

test('render()', t => {
  const style = { width: '100%', height: '100%' }
  const wrapper = shallow(<Tencent url={TEST_URL} />)
  t.true(wrapper.contains(
    <div style={style} id='mock-player-id' />
  ))
})
