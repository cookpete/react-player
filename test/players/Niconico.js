/* global globalThis */

import React from 'react'
import test from 'ava'
import sinon from 'sinon'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Niconico from '../../src/players/Niconico'

configure({ adapter: new Adapter() })

const TEST_URL = 'https://www.nicovideo.jp/watch/sm9'
const TEST_CONFIG = {
  playerId: 'react-player',
  comment: true
}

test('load()', t => {
  const addEventListener = sinon.spy()
  globalThis.addEventListener = addEventListener

  const instance = shallow(
    <Niconico url={TEST_URL} config={TEST_CONFIG} />
  ).instance()
  const postMessage = sinon.spy()
  instance.iframe = {
    contentWindow: {
      postMessage
    }
  }
  instance.load(TEST_URL)
  t.true(addEventListener.calledOnce)
  t.true(postMessage.calledOnce)

  delete globalThis.addEventListener
})

test('getDuration()', t => {
  const instance = shallow(<Niconico url={TEST_URL} config={TEST_CONFIG} />).instance()
  instance.duration = 10
  t.true(instance.getDuration() === 10)
})

test('getCurrentTime()', t => {
  const instance = shallow(<Niconico url={TEST_URL} config={TEST_CONFIG} />).instance()
  instance.currentTime = 5
  t.true(instance.getCurrentTime() === 5)
})

test('getSecondsLoaded()', t => {
  const instance = shallow(<Niconico url={TEST_URL} config={TEST_CONFIG} />).instance()
  instance.secondsLoaded = 5
  t.true(instance.getSecondsLoaded() === 5)
})

test('render()', t => {
  const style = { width: '100%', height: '100%' }
  const wrapper = shallow(<Niconico url={TEST_URL} config={TEST_CONFIG} />)
  t.true(wrapper.contains(
    <iframe
      src='https://embed.nicovideo.jp/watch/sm9?jsapi=1&playerId=react-player'
      frameBorder='0'
      scrolling='no'
      style={style}
      allow='encrypted-media; autoplay; fullscreen;'
    />
  ))
})
