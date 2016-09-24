import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'

import ReactPlayer from '../../src/ReactPlayer'

const { describe, it, beforeEach, afterEach } = window

const TEST_YOUTUBE_URL = 'https://www.youtube.com/watch?v=M7lc1UVf-VE'
const TEST_SOUNDCLOUD_URL = 'https://soundcloud.com/miami-nights-1984/accelerated'
const TEST_STREAMABLE_URL = 'https://streamable.com/moo'
const TEST_VIMEO_URL = 'https://vimeo.com/90509568'
const TEST_FILE_URL = 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.ogv'

const TEST_YOUTUBE_ERROR = 'https://www.youtube.com/watch?v=xxxxxxxxxxx'
const TEST_SOUNDCLOUD_ERROR = 'https://soundcloud.com/xxxxxxxxxxx/xxxxxxxxxxx'
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

  const testStart = (url, done) => {
    render(<ReactPlayer url={url} playing onStart={done} />, div)
  }

  const testPlay = (url, done) => {
    render(<ReactPlayer url={url} playing onPlay={done} />, div)
  }

  const testPause = (url, done) => {
    const onPlay = () => {
      setTimeout(() => {
        render(<ReactPlayer url={url} playing={false} onPause={done} />, div)
      }, 2000)
    }
    testPlay(url, onPlay)
  }

  const testDuration = (url, done) => {
    const onDuration = (duration) => {
      const error = duration && duration > 0 ? null : new Error('Invalid duration: ' + error)
      done(error)
    }
    render(<ReactPlayer url={url} playing onDuration={onDuration} />, div)
  }

  const testDurationDelayed = (url, done) => {
    render(<ReactPlayer url={url} playing={false} />, div, () => {
      testDuration(url, done)
    })
  }

  const testError = (url, onError) => {
    render(<ReactPlayer url={url} playing onError={() => onError()} />, div)
  }

  describe('YouTube', () => {
    it('fires onStart', done => testStart(TEST_YOUTUBE_URL, done))
    it('fires onPlay', done => testPlay(TEST_YOUTUBE_URL, done))
    it('fires onPause', done => testPause(TEST_YOUTUBE_URL, done))
    it('fires onDuration', done => testDuration(TEST_YOUTUBE_URL, done))
    it('fires onDuration with delayed load', done => testDurationDelayed(TEST_YOUTUBE_URL, done))
    it('fires onError', done => testError(TEST_YOUTUBE_ERROR, done))

    it('starts at a specified time', done => {
      const onProgress = state => {
        if (state.played > 0.9) done()
      }
      render(<ReactPlayer url={TEST_YOUTUBE_URL + '?start=22m10s'} playing onProgress={onProgress} />, div)
    })
  })

  describe('SoundCloud', () => {
    it('fires onStart', done => testStart(TEST_SOUNDCLOUD_URL, done))
    it('fires onPlay', done => testPlay(TEST_SOUNDCLOUD_URL, done))
    it.skip('fires onPause', done => testPause(TEST_SOUNDCLOUD_URL, done))
    it('fires onDuration', done => testDuration(TEST_SOUNDCLOUD_URL, done))
    it('fires onDuration with delayed load', done => testDurationDelayed(TEST_SOUNDCLOUD_URL, done))
    it('fires onError', done => testError(TEST_SOUNDCLOUD_ERROR, done))
  })

  describe('Streamable', () => {
    it('fires onStart', done => testStart(TEST_STREAMABLE_URL, done))
    it('fires onPlay', done => testPlay(TEST_STREAMABLE_URL, done))
    it.skip('fires onPause', done => testPause(TEST_STREAMABLE_URL, done))
    it('fires onDuration', done => testDuration(TEST_STREAMABLE_URL, done))
    it('fires onDuration with delayed load', done => testDurationDelayed(TEST_STREAMABLE_URL, done))
  })

  describe('Vimeo', () => {
    it('fires onStart', done => testStart(TEST_VIMEO_URL, done))
    it('fires onPlay', done => testPlay(TEST_VIMEO_URL, done))
    it.skip('fires onPause', done => testPause(TEST_VIMEO_URL, done))
    it('fires onDuration', done => testDuration(TEST_VIMEO_URL, done))
    it('fires onDuration with delayed load', done => testDurationDelayed(TEST_VIMEO_URL, done))
  })

  describe('FilePlayer', () => {
    it('fires onStart', done => testStart(TEST_FILE_URL, done))
    it('fires onPlay', done => testPlay(TEST_FILE_URL, done))
    it.skip('fires onPause', done => testPause(TEST_FILE_URL, done))
    it('fires onDuration', done => testDuration(TEST_FILE_URL, done))
    it('fires onDuration with delayed load', done => testDurationDelayed(TEST_FILE_URL, done))
    it.skip('fires onError', done => testError(TEST_FILE_ERROR, done))
  })

  describe('Switching', () => {
    it('switches between media', function (done) {
      const renderFilePlayer = () => testPlay(TEST_FILE_URL, done)
      const renderVimeoPlayer = () => testPlay(TEST_VIMEO_URL, renderFilePlayer)
      const renderSoundCloudPlayer = () => testPlay(TEST_SOUNDCLOUD_URL, renderVimeoPlayer)
      testPlay(TEST_YOUTUBE_URL, renderSoundCloudPlayer)
    })
  })
})
