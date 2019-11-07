import React from 'react'
import test from 'ava'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import ReactPlayer from '../../src/ReactPlayer'
import Player from '../../src/Player'
import FilePlayer from '../../src/players/FilePlayer'
import DailyMotion from '../../src/players/DailyMotion'
import SoundCloud from '../../src/players/SoundCloud'
import Vimeo from '../../src/players/Vimeo'
import YouTube from '../../src/players/YouTube'

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

test.skip('preload players', t => {
  const config = {
    youtube: { preload: true },
    soundcloud: { preload: true },
    vimeo: { preload: true },
    dailymotion: { preload: true }
  }
  const wrapper = shallow(<ReactPlayer config={config} />)
  const props = {
    playing: true,
    muted: true,
    display: 'none'
  }
  t.true(wrapper.children().length === 4)
  t.true(wrapper.childAt(0).matchesElement(<Player key='DailyMotion' activePlayer={DailyMotion} {...props} />))
  t.true(wrapper.childAt(1).matchesElement(<Player key='SoundCloud' activePlayer={SoundCloud} {...props} />))
  t.true(wrapper.childAt(2).matchesElement(<Player key='Vimeo' activePlayer={Vimeo} {...props} />))
  t.true(wrapper.childAt(3).matchesElement(<Player key='YouTube' activePlayer={YouTube} {...props} />))
})
