import React from 'react'
import test from 'ava'
import sinon from 'sinon'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import testPlayerMethods from '../helpers/testPlayerMethods'
import * as utils from '../../src/utils'
import Asciinema from '../../src/players/Asciinema'
import { MATCH_URL_ASCIINEMA } from '../../src/patterns'

configure({ adapter: new Adapter() })

const TEST_URL = 'https://asciinema.org/a/597732.cast'
const TEST_CONFIG = {
  options: {}
}

const PLAYER_ID = TEST_URL.match(MATCH_URL_ASCIINEMA)[1]

testPlayerMethods(Asciinema, {
  play: 'play',
  pause: 'pause',
  stop: 'pause',
  seekTo: 'seek',
  getDuration: 'getDuration',
  getCurrentTime: 'getCurrentTime',
  getSecondsLoaded: null
}, { config: TEST_CONFIG })

test('load()', t => {
  class Player {
    constructor (id, options) {
      t.true(id === PLAYER_ID)
    }

    addEventListener = (event, fn) => {
      if (event === 'play') setTimeout(fn, 100)
    }
  }
  const getSDK = sinon.stub(utils, 'getSDK').resolves({ Player })
  return new Promise(resolve => {
    const onReady = () => {
      t.pass()
      resolve()
    }
    const instance = shallow(
      <Asciinema url={TEST_URL} onReady={onReady} config={TEST_CONFIG} />
    ).instance()
    instance.load(TEST_URL)
    t.true(getSDK.calledOnce)
    getSDK.restore()
  })
})

test('render()', t => {
  const style = {
    width: '73%',
    height: '100%'
  }
  const wrapper = shallow(<Asciinema url={TEST_URL} config={TEST_CONFIG} />)
  t.true(wrapper.contains(
    <div style={style} id={PLAYER_ID} />
  ))
})
