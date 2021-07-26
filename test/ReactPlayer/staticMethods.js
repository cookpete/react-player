import React from 'react'
import test from 'ava'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import ReactPlayer from '../../src/index'
import Player from '../../src/Player'

global.window = { MediaStream: Object }

configure({ adapter: new Adapter() })

test('canPlay()', t => {
  t.true(ReactPlayer.canPlay('https://www.youtube.com/watch?v=oUFJJNQGwhk'))
  t.true(ReactPlayer.canPlay('https://soundcloud.com/miami-nights-1984/accelerated'))
  t.true(ReactPlayer.canPlay('https://www.facebook.com/facebook/videos/10153231379946729'))
  t.true(ReactPlayer.canPlay('https://vimeo.com/90509568'))
  t.true(ReactPlayer.canPlay('https://www.twitch.tv/videos/106400740'))
  t.true(ReactPlayer.canPlay('https://streamable.com/moo'))
  t.true(ReactPlayer.canPlay('https://home.wistia.com/medias/e4a27b971d'))
  t.true(ReactPlayer.canPlay('https://www.dailymotion.com/video/x5e9eog'))
  t.true(ReactPlayer.canPlay('https://www.mixcloud.com/mixcloud/meet-the-curators'))
  t.true(ReactPlayer.canPlay('http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4'))
  t.false(ReactPlayer.canPlay('http://example.com/random/path'))
})

test('addCustomPlayer()', t => {
  class CustomPlayer {
    static displayName = 'CustomPlayer'
    static canPlay = url => /example\.com/.test(url)
    render () {
      return null
    }
  }
  ReactPlayer.addCustomPlayer(CustomPlayer)
  const wrapper = shallow(<ReactPlayer url='http://example.com/random/path' />)
  t.true(ReactPlayer.canPlay('http://example.com/random/path'))
  t.true(wrapper.find(Player).length === 1)
  t.true(wrapper.find(Player).prop('activePlayer') === CustomPlayer)
  ReactPlayer.removeCustomPlayers()
  t.false(ReactPlayer.canPlay('http://example.com/random/path'))
})
