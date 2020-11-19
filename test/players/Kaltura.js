import React from 'react'
import test from 'ava'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import testPlayerMethods from '../helpers/testPlayerMethods'
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
  seekTo: 'seek',
  setVolume: null,
  mute: null,
  unmute: null,
  getSecondsLoaded: null
})

test('load()', t => {
  const Embed = iframe => {
    t.true(iframe === 'mock-iframe')
    return {
      bind: () => null,
      getDuration: fn => fn(1000),
      load: (url, options) => options.callback()
    }
  }
  return new Promise(resolve => {
    const onReady = () => {
      t.pass()
      resolve()
    }
    const instance = shallow(<Kaltura onReady={onReady} config={TEST_CONFIG} />).instance()
    instance.iframe = 'mock-iframe'
    instance.load(TEST_URL)
  })
})

test('getDuration()', t => {
    // to be implemeneted
})

test('getCurrentTime()', t => {
    // to be implemeneted
})


test('render()', t => {
  const style = {
    width: '100%',
    height: '100%',
  }
  const wrapper = shallow(<Kaltura url={TEST_URL} />)
  t.true(wrapper.contains(
    <iframe
      src={TEST_URL}
      style={style}
      frameBorder={0}
      width="100%"
      allow='encrypted-media'
      referrerPolicy="no-referrer-when-downgrade"
    />
  ))
})
