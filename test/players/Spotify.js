import { test } from 'zora'
import sinon from 'sinon'
import React from 'react'
import { create } from 'react-test-renderer'
import '../helpers/server-safe-globals'
import { testPlayerMethods } from '../helpers/helpers'
import { getSDK as originalGetSDK } from '../../src/utils'
import Spotify from '../../src/players/Spotify'

global.window = {}
const TEST_URL = 'spotify:track:0KhB428j00T8lxKCpHweKw'
const TEST_CONFIG = {
  options: {}
}

testPlayerMethods(Spotify, {
  play: 'resume',
  pause: 'pause',
  stop: 'destroy',
  seekTo: 'seek'
}, { url: TEST_URL })

test('load()', t => {
  class Player {
    constructor (container) {
      t.ok(container === 'mock-container')
    }
  }
  const getSDK = sinon.stub(originalGetSDK, 'stub').resolves({ Player })

  const instance = create(
    <Spotify url={TEST_URL} config={TEST_CONFIG} />
  ).getInstance()
  instance.iframe = 'mock-container'
  instance.load(TEST_URL)
  t.truthy(window.onSpotifyIframeApiReady)
  t.ok(getSDK.calledOnce)
  getSDK.restore()
})

test('render()', t => {
  const style = { width: '100%', height: '100%' }
  t.deepEqual(
    create(<Spotify url={TEST_URL} />).toJSON(),
    create(
      <div style={style}>
        <div />
      </div>
    ).toJSON()
  )
})
