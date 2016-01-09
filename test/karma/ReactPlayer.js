import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'

import ReactPlayer from '../../src/ReactPlayer'

const { describe, it, beforeEach, afterEach } = window
const TEST_YOUTUBE_URL = 'https://www.youtube.com/watch?v=GlCmAC4MHek'
const TEST_SOUNDCLOUD_URL = 'https://soundcloud.com/miami-nights-1984/accelerated'
const TEST_VIMEO_URL = 'https://vimeo.com/90509568'
const TEST_FILE_URL = 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.ogv'

describe('ReactPlayer', () => {
  let div

  beforeEach(() => {
    div = document.createElement('div')
    document.body.appendChild(div)
  })

  afterEach(() => {
    unmountComponentAtNode(div)
    document.body.removeChild(div)
  })

  const testPlay = (url, onPlay) => {
    render(<ReactPlayer url={url} playing onPlay={onPlay} />, div)
  }

  const testPause = (url, done) => {
    const onPlay = () => {
      setTimeout(() => {
        render(<ReactPlayer url={url} playing={false} onPause={done} />, div)
      }, 500)
    }
    testPlay(url, onPlay)
  }

  it('plays a YouTube video', done => testPlay(TEST_YOUTUBE_URL, done))
  it('plays a SoundCloud track', done => testPlay(TEST_SOUNDCLOUD_URL, done))
  it('plays a Vimeo video', done => testPlay(TEST_VIMEO_URL, done))
  it('plays a file', done => testPlay(TEST_FILE_URL, done))

  it('pauses a YouTube video', done => testPause(TEST_YOUTUBE_URL, done))
  it('pauses a SoundCloud track', done => testPause(TEST_SOUNDCLOUD_URL, done))
  it('pauses a Vimeo video', done => testPause(TEST_VIMEO_URL, done))
  it('pauses a file', done => testPause(TEST_FILE_URL, done))

  it('switches between media', function (done) {
    const renderPlayer = (url, onPlay) => render(<ReactPlayer url={url} playing onPlay={onPlay} />, div)
    const renderFilePlayer = () => renderPlayer(TEST_FILE_URL, done)
    const renderVimeoPlayer = () => renderPlayer(TEST_VIMEO_URL, renderFilePlayer)
    const renderSoundCloudPlayer = () => renderPlayer(TEST_SOUNDCLOUD_URL, renderVimeoPlayer)
    renderPlayer(TEST_YOUTUBE_URL, renderSoundCloudPlayer)
  })
})
