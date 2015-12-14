import React from 'react'
import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import { createRenderer } from 'react-addons-test-utils'

import ReactPlayer from '../src/ReactPlayer'
import YouTube from '../src/players/YouTube'
import Vimeo from '../src/players/Vimeo'
import SoundCloud from '../src/players/SoundCloud'
import FilePlayer from '../src/players/FilePlayer'

const YOUTUBE_URL = 'https://www.youtube.com/watch?v=oUFJJNQGwhk'
const SOUNDCLOUD_URL = 'https://soundcloud.com/miami-nights-1984/accelerated'
const VIMEO_URL = 'https://vimeo.com/90509568'
const FILE_URL = 'https://example.com/video.mp4'

describe('ReactPlayer', () => {
  let shallowRenderer

  beforeEach(() => {
    shallowRenderer = createRenderer()
  })

  it('renders YouTube player', () => {
    shallowRenderer.render(<ReactPlayer url={YOUTUBE_URL} />)
    const result = shallowRenderer.getRenderOutput()
    const activePlayer = getActivePlayer(result)
    expect(activePlayer.type).to.equal(YouTube)
  })

  it('renders SoundCloud player', () => {
    shallowRenderer.render(<ReactPlayer url={SOUNDCLOUD_URL} />)
    const result = shallowRenderer.getRenderOutput()
    const activePlayer = getActivePlayer(result)
    expect(activePlayer.type).to.equal(SoundCloud)
  })

  it('renders Vimeo player', () => {
    shallowRenderer.render(<ReactPlayer url={VIMEO_URL} />)
    const result = shallowRenderer.getRenderOutput()
    const activePlayer = getActivePlayer(result)
    expect(activePlayer.type).to.equal(Vimeo)
  })

  it('renders FilePlayer', () => {
    shallowRenderer.render(<ReactPlayer url={FILE_URL} />)
    const result = shallowRenderer.getRenderOutput()
    const activePlayer = getActivePlayer(result)
    expect(activePlayer.type).to.equal(FilePlayer)
  })
})

function getActivePlayer (result) {
  return result.props.children.find(player => player.ref === 'player')
}
