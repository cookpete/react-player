import React from 'react'
import test from 'ava'
import sinon from 'sinon'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import testPlayerMethods from '../helpers/testPlayerMethods'
import * as utils from '../../src/utils'
import Asciinema from '../../src/players/Asciinema'
import { MATCH_URL_ASCIINEMA } from '../../src/patterns'

global.window = {}

configure({ adapter: new Adapter() })

const TEST_URL = 'https://asciinema.org/a/597732'
const LOOP = true
const RATE = 1.5
const TEST_CONFIG = {
  fit: 'both',
  poster: 'npt:1:21',
  controls: true,
  startAt: 7,
  idleTimeLimit: 2,
  terminalFontSize: 'medium'
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

test('load()', async t => {
  const AsciinemaPlayer = {
    create: () => ({
      ready: Promise.resolve(),
      addEventListener: (event, fn) => {
        if (event === 'play') setTimeout(fn, 100)
      }
    })
  }

  const getSDK = sinon.stub(utils, 'getSDK').resolves(AsciinemaPlayer)
  const onReady = () => t.pass()
  const instance = shallow(
    <Asciinema url={TEST_URL} id={PLAYER_ID} onReady={onReady} config={TEST_CONFIG} loop={LOOP} playbackRate={RATE} controls />
  ).instance()
  instance.load(TEST_URL)
  t.true(getSDK.calledOnce)
  getSDK.restore()
})

test('render()', t => {
  const style = {
    width: '100%',
    height: '100%'
  }

  const wrapper = shallow(<Asciinema url={TEST_URL} id={PLAYER_ID} config={TEST_CONFIG} loop={LOOP} playbackRate={RATE} controls />)
  t.true(wrapper.contains(
    <div style={style} />
  ))
})
