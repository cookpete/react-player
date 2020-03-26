import React from 'react'
import test from 'ava'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Spotify } from '../../src/players/Spotify'

configure({ adapter: new Adapter() })

const TEST_URL = 'https://open.spotify.com/track/69kOkLUCkxIZYexIgSG8rq?si=mVt5ng3PSHar7yZETf7gOg'

test('render()', t => {
  const wrapper = shallow(<Spotify url={TEST_URL} />)
  const style = {
    width: '100%',
    height: '100%'
  }
  t.true(wrapper.contains(
    <iframe
      src='https://open.spotify.com/track/69kOkLUCkxIZYexIgSG8rq?si=mVt5ng3PSHar7yZETf7gOg'
      style={style}
      frameBorder={0}
      allowtransparency='true'
      allow='encrypted-media'
    />
  ))
})
