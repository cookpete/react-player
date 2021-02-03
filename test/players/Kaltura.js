import React from 'react'
import test from 'ava'
import sinon from 'sinon'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import testPlayerMethods from '../helpers/testPlayerMethods'
import * as utils from '../../src/utils'
import Kaltura from '../../src/players/Kaltura'

configure({ adapter: new Adapter() })

const TEST_URL = 'https://cdnapisec.kaltura.com/p/2507381/sp/250738100/embedIframeJs/uiconf_id/44372392/partner_id/2507381?iframeembed=true&playerId=kaltura_player_1605622336&entry_id=1_i1jmzcn3'
const TEST_CONFIG = {
  options: {}
}

testPlayerMethods(Kaltura, {
  play: 'play',
  pause: 'pause',
  stop: null,
  seekTo: 'setCurrentTime',
  setVolume: 'setVolume',
  mute: 'mute',
  unmute: 'unmute'
}, { url: TEST_URL })

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
      <Kaltura url={TEST_URL} onReady={onReady} config={TEST_CONFIG} />
    ).instance()
    instance.iframe = 'mock-iframe'
    instance.load(TEST_URL)
    t.true(getSDK.calledOnce)
    getSDK.restore()
  })
})

test('getDuration()', t => {
  const instance = shallow(<Kaltura url={TEST_URL} />).instance()
  instance.duration = 10
  t.true(instance.getDuration() === 10)
})

test('getCurrentTime()', t => {
  const instance = shallow(<Kaltura url={TEST_URL} />).instance()
  instance.currentTime = 5
  t.true(instance.getCurrentTime() === 5)
})

test('getSecondsLoaded()', t => {
  const instance = shallow(<Kaltura url={TEST_URL} />).instance()
  instance.secondsLoaded = 5
  t.true(instance.getSecondsLoaded() === 5)
})

test('render()', t => {
  const style = { width: '100%', height: '100%' }
  const wrapper = shallow(<Kaltura url={TEST_URL} />)
  t.true(wrapper.contains(
    <iframe
      src={TEST_URL}
      frameBorder='0'
      scrolling='no'
      style={style}
      allowFullScreen
      allow='encrypted-media'
      referrerPolicy='no-referrer-when-downgrade'
    />
  ))
})
