import { test } from 'zora'
import sinon from 'sinon'
import React from 'react'
import { create } from 'react-test-renderer'
import '../helpers/server-safe-globals'
import { testPlayerMethods } from '../helpers/helpers'
import { getSDK as originalGetSDK } from '../../src/utils'
import Gumlet from '../../src/players/Gumlet'

const TEST_URL = 'https://play.gumlet.io/embed/64bfb0913ed6e5096d66dc1e'
const TEST_CONFIG = {
  options: {}
}

testPlayerMethods(Gumlet, {
  play: 'play',
  pause: 'pause',
  stop: null,
  seekTo: 'setCurrentTime',
  setVolume: 'setVolume',
  mute: 'mute',
  unmute: 'unmute'
}, { url: TEST_URL })

test('load()', t => {
  class Player {
    constructor (iframe) {
      t.ok(iframe === 'mock-iframe')
    }

    on = (event, fn) => {
      if (event === 'ready') setTimeout(fn, 100)
    }

    setLoop = () => null
  }
  const getSDK = sinon.stub(originalGetSDK, 'stub').resolves({ Player })
  return new Promise(resolve => {
    const onReady = () => {
      t.ok(true)
      resolve()
    }
    const instance = create(
      <Gumlet url={TEST_URL} onReady={onReady} config={TEST_CONFIG} />
    ).getInstance()
    instance.iframe = 'mock-iframe'
    instance.load(TEST_URL)
    t.ok(getSDK.calledOnce)
    getSDK.restore()
  })
})

test('render()', t => {
  const style = { width: '100%', height: '100%' }
  t.deepEqual(
    create(<Gumlet url={TEST_URL} />).toJSON(),
    create(<iframe
      loading="lazy" 
      src={TEST_URL}
      style={style}
      allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen;"
      allowFullScreen
           />).toJSON()
  )
})
