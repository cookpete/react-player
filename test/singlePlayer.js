import React from 'react'
import test from 'ava'
import sinon from 'sinon'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import createSinglePlayer from '../src/singlePlayer'
import { FilePlayer } from '../src/players/FilePlayer'
import Player from '../src/Player'

global.window = { MediaStream: Object }

configure({ adapter: new Adapter() })

const SinglePlayer = createSinglePlayer(FilePlayer)

const COMMON_METHODS = ['getDuration', 'getCurrentTime', 'getSecondsLoaded', 'getInternalPlayer']

for (const method of COMMON_METHODS) {
  test(`${method}()`, t => {
    const instance = shallow(<SinglePlayer />).instance()
    instance.ref({ [method]: () => 123 })
    t.true(instance[method]() === 123)
  })

  test(`${method}() - null`, t => {
    const instance = shallow(<SinglePlayer />).instance()
    t.true(instance[method]() === null)
  })
}

test('getInternalPlayer() - default', t => {
  const instance = shallow(<SinglePlayer />).instance()
  const getInternalPlayer = sinon.fake.returns('abc')
  instance.ref({ getInternalPlayer })
  t.true(instance.getInternalPlayer() === 'abc')
  t.true(getInternalPlayer.calledOnceWith('player'))
})

test('seekTo()', t => {
  const seekTo = sinon.fake()
  const instance = shallow(<SinglePlayer />).instance()
  instance.ref({ seekTo })
  instance.seekTo(5)
  t.true(seekTo.calledOnceWith(5))
})

test('seekTo() - null', t => {
  const instance = shallow(<SinglePlayer />).instance()
  t.true(instance.seekTo() === null)
})

test('ref', t => {
  const instance = shallow(<SinglePlayer />).instance()
  instance.ref('abc')
  t.true(instance.player === 'abc')
})

test('config - deprecated config', t => {
  const stub = sinon.stub(console, 'warn')
  const youtubeConfig = { playerVars: { showinfo: 1 } }
  const wrapper = shallow(<SinglePlayer youtubeConfig={youtubeConfig} />)
  t.true(wrapper.instance().config.youtube.playerVars.showinfo === 1)
  t.true(stub.calledOnce)
  stub.restore()
})

test('config - updates', t => {
  const config = { youtube: { playerVars: { showinfo: 1 } } }
  const wrapper = shallow(<SinglePlayer config={config} />)
  t.true(wrapper.instance().config.youtube.playerVars.showinfo === 1)
  wrapper.setProps({ config: { youtube: { playerVars: { showinfo: 0 } } } })
  t.true(wrapper.instance().config.youtube.playerVars.showinfo === 0)
})

test('render', t => {
  const wrapper = shallow(<SinglePlayer url='http://example.com/file.mp4' />)
  t.true(wrapper.childAt(0).matchesElement(
    <Player activePlayer={FilePlayer} />
  ))
})

test('render - null', t => {
  const wrapper = shallow(<SinglePlayer url='http://example.com/not-a-file-path' />)
  t.true(wrapper.type() === null)
})

test('render - force via config', t => {
  const wrapper = shallow(<SinglePlayer url='http://example.com/not-a-file-path' config={{ file: { forceVideo: true } }} />)
  const player = wrapper.childAt(0)
  t.true(player.is(Player))
  t.true(player.prop('activePlayer') === FilePlayer)
  t.true(player.prop('url') === 'http://example.com/not-a-file-path')

  // This fails, but I don't know why
  // t.true(wrapper.childAt(0).matchesElement(
  //   <Player activePlayer={FilePlayer} />
  // ))
})
