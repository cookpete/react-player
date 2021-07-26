import React from 'react'
import test from 'ava'
import sinon from 'sinon'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import testPlayerMethods from '../helpers/testPlayerMethods'
import * as utils from '../../src/utils'
import Twitch from '../../src/players/Twitch'

configure({ adapter: new Adapter() })

const TEST_URL = 'https://www.twitch.tv/videos/106400740'
const TEST_CONFIG = {
  options: {}
}

Twitch.prototype.componentWillMount = function () {
  this.playerID = 'mock-player-id'
}

testPlayerMethods(Twitch, {
  play: 'play',
  pause: 'pause',
  stop: 'pause',
  seekTo: 'seek',
  setVolume: 'setVolume',
  mute: 'setMuted',
  unmute: 'setMuted',
  getDuration: 'getDuration',
  getCurrentTime: 'getCurrentTime',
  getSecondsLoaded: null
}, { config: TEST_CONFIG })

test('load()', t => {
  class Player {
    static READY = 'READY'
    static PLAY = 'PLAY'
    static PAUSE = 'PAUSE'
    static ENDED = 'ENDED'
    constructor (id, options) {
      t.true(id === 'mock-player-id')
    }

    addEventListener = (event, fn) => {
      if (event === 'READY') setTimeout(fn, 100)
    }
  }
  const getSDK = sinon.stub(utils, 'getSDK').resolves({ Player })
  return new Promise(resolve => {
    const onReady = () => {
      t.pass()
      resolve()
    }
    const instance = shallow(
      <Twitch url={TEST_URL} onReady={onReady} config={TEST_CONFIG} />
    ).instance()
    instance.load(TEST_URL)
    t.true(getSDK.calledOnce)
    getSDK.restore()
  })
})

test('render()', t => {
  const style = { width: '100%', height: '100%' }
  const wrapper = shallow(<Twitch url={TEST_URL} config={TEST_CONFIG} />)
  t.true(wrapper.contains(
    <div style={style} id='mock-player-id' />
  ))
})
