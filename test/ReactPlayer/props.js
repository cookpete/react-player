import React from 'react'
import test from 'ava'
import sinon from 'sinon'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import ReactPlayer from '../../src/ReactPlayer'

configure({ adapter: new Adapter() })

test('className', t => {
  const wrapper = shallow(<ReactPlayer className='react-player' />)
  t.true(wrapper.hasClass('react-player'))
})

test('style', t => {
  const wrapper = shallow(<ReactPlayer style={{ marginTop: '1rem' }} />)
  t.true(wrapper.get(0).props.style.marginTop === '1rem')
})

test('wrapper - string', t => {
  const wrapper = shallow(<ReactPlayer wrapper='span' />)
  t.true(wrapper.getElement().type === 'span')
})

test('wrapper - element', t => {
  const Element = () => null
  const wrapper = shallow(<ReactPlayer wrapper={Element} />)
  t.true(wrapper.getElement().type === Element)
})

test('progressFrequency warning', t => {
  const stub = sinon.stub(console, 'warn')
  shallow(<ReactPlayer progressFrequency={100} />)
  t.true(stub.calledOnce)
  stub.restore()
})

test('config - deprecated config', t => {
  const stub = sinon.stub(console, 'warn')
  const youtubeConfig = { playerVars: { showinfo: 1 } }
  const wrapper = shallow(<ReactPlayer youtubeConfig={youtubeConfig} />)
  t.true(wrapper.instance().config.youtube.playerVars.showinfo === 1)
  t.true(stub.calledOnce)
  stub.restore()
})

test('config - updates', t => {
  const config = { youtube: { playerVars: { showinfo: 1 } } }
  const wrapper = shallow(<ReactPlayer config={config} />)
  t.true(wrapper.instance().config.youtube.playerVars.showinfo === 1)
  wrapper.setProps({ config: { youtube: { playerVars: { showinfo: 0 } } } })
  t.true(wrapper.instance().config.youtube.playerVars.showinfo === 0)
})
