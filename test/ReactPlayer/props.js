import React from 'react'
import test from 'ava'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import ReactPlayer from '../../src/index'

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
