import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'

import ReactPlayer from '../../src/ReactPlayer'

const { describe, it, beforeEach, afterEach } = window
const TEST_YOUTUBE_URL = 'https://www.youtube.com/watch?v=GlCmAC4MHek'
const TEST_SOUNDCLOUD_URL = 'https://soundcloud.com/miami-nights-1984/accelerated'
const TEST_VIMEO_URL = 'https://vimeo.com/90509568'
const TEST_FILE_URL = 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.ogv'

const TEST_YOUTUBE_ERROR = 'https://www.youtube.com/watch?v=xxxxxxxxxxx'
const TEST_SOUNDCLOUD_ERROR = 'https://soundcloud.com/xxxxxxxxxxx/xxxxxxxxxxx'
const TEST_VIMEO_ERROR = 'https://vimeo.com/00000000'
const TEST_FILE_ERROR = 'http://example.com/error.ogv'

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

  const testDuration = (url, done) => {
    const onDuration = duration => {
      if (duration && duration > 0) done()
    }
    render(<ReactPlayer url={url} playing onDuration={onDuration} />, div)
  }

  const testError = (url, onError) => {
    render(<ReactPlayer url={url} playing onError={onError} />, div)
  }

  it('plays a YouTube video', done => testPlay(TEST_YOUTUBE_URL, done))
  it('plays a SoundCloud track', done => testPlay(TEST_SOUNDCLOUD_URL, done))
  it('plays a Vimeo video', done => testPlay(TEST_VIMEO_URL, done))
  it('plays a file', done => testPlay(TEST_FILE_URL, done))

  it('pauses a YouTube video', done => testPause(TEST_YOUTUBE_URL, done))
  it('pauses a SoundCloud track', done => testPause(TEST_SOUNDCLOUD_URL, done))
  it('pauses a Vimeo video', done => testPause(TEST_VIMEO_URL, done))
  it('pauses a file', done => testPause(TEST_FILE_URL, done))

  it('gets duration for YouTube video', done => testDuration(TEST_YOUTUBE_URL, done))
  it('gets duration for SoundCloud track', done => testDuration(TEST_SOUNDCLOUD_URL, done))
  it('gets duration for Vimeo video', done => testDuration(TEST_VIMEO_URL, done))
  it('gets duration for file', done => testDuration(TEST_FILE_URL, done))

  it('fires onError for YouTube video', done => testError(TEST_YOUTUBE_ERROR, done))
  it('fires onError for SoundCloud track', done => testError(TEST_SOUNDCLOUD_ERROR, done))
  it('fires onError for Vimeo video', done => testError(TEST_VIMEO_ERROR, done))
  it('fires onError for file', done => testError(TEST_FILE_ERROR, done))

  it('switches between media', function (done) {
    const renderPlayer = (url, onPlay) => render(<ReactPlayer url={url} playing onPlay={onPlay} />, div)
    const renderFilePlayer = () => renderPlayer(TEST_FILE_URL, done)
    const renderVimeoPlayer = () => renderPlayer(TEST_VIMEO_URL, renderFilePlayer)
    const renderSoundCloudPlayer = () => renderPlayer(TEST_SOUNDCLOUD_URL, renderVimeoPlayer)
    renderPlayer(TEST_YOUTUBE_URL, renderSoundCloudPlayer)
  })
})
