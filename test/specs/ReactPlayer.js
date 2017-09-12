/* eslint-disable no-unused-expressions */

import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'

import ReactPlayer from '../../src/ReactPlayer'

const { describe, it, expect, beforeEach, afterEach } = window

const TEST_URLS = [
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/watch?v=M7lc1UVf-VE',
    error: 'https://www.youtube.com/watch?v=xxxxxxxxxxx'
  },
  {
    name: 'SoundCloud',
    url: 'https://soundcloud.com/miami-nights-1984/accelerated',
    error: 'https://soundcloud.com/xxxxxxxxxxx/xxxxxxxxxxx'
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/facebook/videos/10153231379946729/'
  },
  {
    name: 'Vimeo',
    url: 'https://vimeo.com/90509568',
    seek: true
  },
  {
    name: 'Twitch',
    url: 'https://www.twitch.tv/videos/106400740'
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
    url: 'https://home.wistia.com/medias/e4a27b971d',
    seek: true
  },
  {
    name: 'DailyMotion',
    url: 'http://www.dailymotion.com/video/x2buxsr',
    seek: true
  },
  {
    name: 'FilePlayer',
    url: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.ogv',
    error: 'http://example.com/error.ogv',
    seek: true
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
      it('canPlay', () => {
        expect(ReactPlayer.canPlay(test.url)).to.be.true
      })

      it('onReady, onStart, onPlay, onDuration, onProgress', done => {
        // Use a count object to ensure everything is called at least once
        let count = {}
        const bump = key => {
          count[key] = count[key] || 0
          count[key]++
          if (Object.keys(count).length === 5) {
            done()
          }
        }
        let player
        render(
          <ReactPlayer
            ref={p => { player = p || player }}
            url={test.url}
            playing
            onReady={() => bump('onReady')}
            onStart={() => bump('onStart')}
            onPlay={() => bump('onPlay')}
            onDuration={secs => bump('onDuration')}
            onProgress={progress => bump('onProgress')}
          />,
        div)
      })

      it('onPause', done => {
        const onPause = () => done()
        const pausePlayer = () => {
          render(
            <ReactPlayer
              url={test.url}
              playing={false}
              onPause={onPause}
            />,
          div)
        }
        render(
          <ReactPlayer
            url={test.url}
            playing
            onPause={onPause}
            onProgress={p => {
              if (p.playedSeconds >= 3) {
                pausePlayer()
              }
            }}
          />,
        div)
      })

      if (test.error) {
        it('onError', done => {
          render(
            <ReactPlayer
              url={test.error}
              playing
              onError={() => done()}
            />,
          div)
        })
      }

      if (test.seek) {
        it('seekTo, onSeek', done => {
          let player
          render(
            <ReactPlayer
              ref={p => { player = p || player }}
              url={test.url}
              playing
              onProgress={p => {
                if (p.playedSeconds >= 3) {
                  player.seekTo(10)
                }
              }}
              onSeek={() => done()}
            />,
          div)
        })
      }
    })
  }

  describe('instance methods', () => {
    let player
    beforeEach(done => {
      render(
        <ReactPlayer
          ref={p => { player = p || player }}
          url='http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4'
          onReady={() => done()}
        />,
      div)
    })

    it('returns correctly', () => {
      expect(player.getInternalPlayer()).to.exist
      expect(player.getCurrentTime()).to.be.a('number')
      expect(player.getDuration()).to.be.a('number')
    })
  })

  describe('preloading', () => {
    let player
    beforeEach(done => {
      render(
        <ReactPlayer
          ref={p => {
            if (p) {
              player = p
              done()
            }
          }}
          url={null}
          config={{
            youtube: { preload: true },
            vimeo: { preload: true },
            dailymotion: { preload: true }
          }}
        />,
      div)
    })

    it('renders with preload config', () => {
      expect(player.wrapper).to.be.a('HTMLDivElement')
      expect(player.wrapper.childNodes).to.have.length(3)
      for (let div of player.wrapper.childNodes) {
        expect(div.style.display).to.equal('none')
      }
    })
  })

  it('canPlay returns false', () => {
    expect(ReactPlayer.canPlay('http://example.com')).to.be.false
    expect(ReactPlayer.canPlay('file.txt')).to.be.false
  })
})
