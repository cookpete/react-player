import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'

import ReactPlayer from '../../src/ReactPlayer'

const { describe, it, expect, beforeEach, afterEach } = window

const TEST_URLS = [
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/watch?v=M7lc1UVf-VE'
  },
  {
    name: 'SoundCloud',
    url: 'https://soundcloud.com/miami-nights-1984/accelerated'
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/facebook/videos/10153231379946729/'
  },
  {
    name: 'Vimeo',
    url: 'https://vimeo.com/90509568'
  },
  {
    name: 'Twitch',
    url: 'https://www.twitch.tv/videos/28946623',
    skip: true
  },
  {
    name: 'Streamable',
    url: 'https://streamable.com/moo'
  },
  {
    name: 'Vidme',
    url: 'https://vid.me/yvi'
  },
  {
    name: 'Wistia',
    url: 'https://home.wistia.com/medias/e4a27b971d'
  },
  {
    name: 'DailyMotion',
    url: 'http://www.dailymotion.com/video/x26m1j4_wildlife_animals',
    skip: true
  },
  {
    name: 'FilePlayer',
    url: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.ogv'
  },
  {
    name: 'FilePlayer (multiple sources)',
    url: [
      { src: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4', type: 'video/mp4' },
      { src: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.ogv', type: 'video/ogv' },
      { src: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.webm', type: 'video/webm' }
    ]
  },
  {
    name: 'FilePlayer (HLS)',
    url: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8'
  },
  {
    name: 'FilePlayer (DASH)',
    url: 'http://dash.edgesuite.net/envivio/EnvivioDash3/manifest.mpd'
  }
]

const TEST_ERROR_URLS = [
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/watch?v=xxxxxxxxxxx'
  },
  {
    name: 'SoundCloud',
    url: 'https://soundcloud.com/xxxxxxxxxxx/xxxxxxxxxxx'
  },
  {
    name: 'FilePlayer',
    url: 'http://example.com/error.ogv'
  }
]

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

  for (let test of TEST_URLS) {
    const desc = test.skip ? describe.skip : describe
    desc(test.name, () => {
      it('onReady, onStart, onPlay, onDuration, onProgress', done => {
        let count = {}
        const bump = key => {
          count[key] = count[key] || 0
          count[key]++
          if (Object.keys(count).length === 5) {
            done()
          }
        }
        render(
          <ReactPlayer
            url={test.url}
            playing
            onReady={() => bump('onReady')}
            onStart={() => bump('onStart')}
            onPlay={() => bump('onPlay')}
            onDuration={secs => {
              expect(secs).to.be.a('number')
              expect(secs).to.be.above(0)
              bump('onDuration')
            }}
            onProgress={progress => {
              expect(progress).to.be.an('object')
              bump('onProgress')
            }}
          />,
        div)
      })
    })
  }

  for (let test of TEST_ERROR_URLS) {
    describe(test.name, () => {
      it('onError', done => {
        render(
          <ReactPlayer
            url={test.url}
            playing
            onError={() => done()}
          />,
        div)
      })
    })
  }
})
