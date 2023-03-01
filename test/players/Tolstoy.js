import React from 'react'
import test from 'ava'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Tolstoy from '../../src/players/Tolstoy'

configure({ adapter: new Adapter() })

const TEST_URL = 'https://player.gotolstoy.com/k9hl9e53n97nx?hostdsfterwfew'

test('render()', t => {
  const style = { width: '100%', height: '100%' }
  const wrapper = shallow(<Tolstoy url={TEST_URL}/>)
  t.true(wrapper.contains(
    <iframe
      frameBorder="0"
      scrolling="no"
      style={style}
      title="Tolstoy-player"
      allow="autoplay *; clipboard-write *;camera *; microphone *; encrypted-media *; fullscreen *; display-capture *;"/>
  ))
})
