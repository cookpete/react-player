import React from 'react'
import test from 'ava'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import ReactPlayer from '../../src/index'
import Player from '../../src/Player'
import FilePlayer from '../../src/players/FilePlayer'

global.window = { MediaStream: Object }

configure({ adapter: new Adapter() })

test.skip('render', t => {
  const wrapper = shallow(<ReactPlayer />)
  t.true(wrapper.equals(
    <div style={{ width: '640px', height: '360px' }}>
      {null}
    </div>
  ))
})

test.skip('fallback player', t => {
  const wrapper = shallow(<ReactPlayer url='http://example.com/random/path' />)
  t.true(wrapper.childAt(0).matchesElement(
    <Player activePlayer={FilePlayer} onReady={wrapper.instance().handleReady} />
  ))
})
