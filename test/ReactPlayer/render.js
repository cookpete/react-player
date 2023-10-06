import React from 'react'
import { test } from 'zora'
import { create } from 'react-test-renderer'
import ReactPlayer from '../../src/index'
import Player from '../../src/Player'
import FilePlayer from '../../src/players/FilePlayer'

globalThis.window = { MediaStream: Object }

test.skip('render', t => {
  const wrapper = create(<ReactPlayer />)
  t.ok(wrapper.equals(
    <div style={{ width: '640px', height: '360px' }}>
      {null}
    </div>
  ))
})

test.skip('fallback player', t => {
  const wrapper = create(<ReactPlayer url='http://example.com/random/path' />)
  t.ok(wrapper.childAt(0).matchesElement(
    <Player activePlayer={FilePlayer} onReady={wrapper.instance().handleReady} />
  ))
})
