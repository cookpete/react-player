/* eslint-disable no-unused-expressions */

import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'

import ReactPlayer from '../../src/ReactPlayer'

const { describe, it, expect, beforeEach, afterEach } = window

const TEST_URLS = [
  {
    name: 'FilePlayer',
    url: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.ogv',
    switchTo: 'https://storage.googleapis.com/media-session/elephants-dream/the-wires.mp3',
    error: 'http://example.com/error.ogv',
    onSeek: true
  },
  {
    name: 'FilePlayer (multiple string sources)',
    url: [
      'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
      'http://clips.vorwaerts-gmbh.de/big_buck_bunny.ogv',
      'http://clips.vorwaerts-gmbh.de/big_buck_bunny.webm'
    ]
  },
  {
    name: 'FilePlayer (multiple object sources)',
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
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/watch?v=M7lc1UVf-VE',
    switchTo: 'https://www.youtube.com/watch?v=oUFJJNQGwhk',
    error: 'https://www.youtube.com/watch?v=xxxxxxxxxxx'
  },
  {
    name: 'SoundCloud',
    url: 'https://soundcloud.com/miami-nights-1984/accelerated',
    switchTo: 'https://soundcloud.com/tycho/tycho-awake',
    error: 'https://soundcloud.com/xxxxxxxxxxx/xxxxxxxxxxx'
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/facebook/videos/10153231379946729/',
    switchTo: 'https://www.facebook.com/FacebookDevelopers/videos/10152454700553553/'
  },
  {
    name: 'Vimeo',
    url: 'https://vimeo.com/90509568',
    switchTo: 'https://vimeo.com/169599296',
    error: 'http://vimeo.com/00000000',
    onSeek: true
  },
  {
    name: 'Twitch',
    url: 'https://www.twitch.tv/videos/106400740',
    switchTo: 'https://www.twitch.tv/videos/175705374'
  },
  {
    name: 'Streamable',
    url: 'https://streamable.com/moo',
    switchTo: 'https://streamable.com/ifjh'
  },
  {
    name: 'Wistia',
    url: 'https://home.wistia.com/medias/e4a27b971d',
    switchTo: 'https://home.wistia.com/medias/29b0fbf547',
    onSeek: true,
    skip: true
  },
  {
    name: 'DailyMotion',
    url: 'https://www.dailymotion.com/video/x5e9eog',
    switchTo: 'https://www.dailymotion.com/video/x61xx3z',
    error: 'http://www.dailymotion.com/video/x6c0xvb',
    onSeek: true,
    skip: true
  },
  {
    name: 'Mixcloud',
    url: 'https://www.mixcloud.com/mixcloud/meet-the-curators/',
    switchTo: 'https://www.mixcloud.com/mixcloud/mixcloud-curates-4-mary-anne-hobbs-in-conversation-with-dan-deacon/',
    skip: true
  },
  {
    name: 'Ustream',
    url: 'http://www.ustream.tv/channel/9408562',
    switchTo: 'http://www.ustream.tv/channel/6540154'
  }
]

describe('ReactPlayer', () => {
  let div // Top level div to render into
  let player // Top level player var that will always contain the latest player instance

  // Test util for rendering a player
  function renderPlayer (props, onMount) {
    const ref = p => {
      if (p) {
        player = p
        if (onMount) {
          onMount()
        }
      }
    }
    // Note that playing is set to true by default
    render(<ReactPlayer ref={ref} playing {...props} />, div)
  }

  // Test util for rendering a player and then changing props after a short time
  function renderPlayerChange (props, changeProps, onChange) {
    renderPlayer({
      ...props,
      onProgress: p => {
        if (changeProps && p.playedSeconds > 3) {
          renderPlayer({ ...props, ...changeProps })
          if (onChange) {
            onChange()
          }
        }
        if (props.onProgress) {
          props.onProgress(p)
        }
      }
    })
  }

  beforeEach(() => {
    div = document.createElement('div')
    document.body.appendChild(div)
  })

  afterEach(() => {
    unmountComponentAtNode(div)
    document.body.removeChild(div)
  })

  for (let test of TEST_URLS) {
    const desc = test.skip ? describe.skip : (test.only ? describe.only : describe)
    desc(test.name, () => {
      it('canPlay', () => {
        expect(ReactPlayer.canPlay(test.url)).to.be.true
        expect(ReactPlayer.canPlay('random-string')).to.be.false
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
        renderPlayer({
          url: test.url,
          onReady: () => bump('onReady'),
          onStart: () => bump('onStart'),
          onPlay: () => bump('onPlay'),
          onDuration: secs => bump('onDuration'),
          onProgress: progress => bump('onProgress')
        })
      })

      it('onPause', done => {
        const props = {
          url: test.url,
          onPause: () => done(),
          playing: true
        }
        renderPlayerChange(props, { playing: false })
      })

      it('should not play if playing is false', done => {
        renderPlayer({
          url: test.url,
          playing: false,
          onReady: () => setTimeout(done, 1000),
          onPlay: () => done('should not play if playing is false')
        })
      })

      it('plays after a delay', done => {
        const playPlayer = () => {
          renderPlayer({
            url: test.url,
            playing: true,
            onPlay: () => done()
          })
        }
        renderPlayer({
          url: test.url,
          playing: false,
          onReady: () => setTimeout(playPlayer, 1000)
        })
      })

      it('volume change does not error', done => {
        renderPlayerChange(
          { url: test.url, volume: 1 },
          { volume: 0.5 },
          () => setTimeout(done, 1000)
        )
      })

      it('muted change does not error', done => {
        renderPlayerChange(
          { url: test.url, muted: false },
          { muted: true },
          () => setTimeout(done, 1000)
        )
      })

      it('playbackRate change does not error', done => {
        renderPlayerChange(
          { url: test.url, playbackRate: 1 },
          { playbackRate: 0.5 },
          () => setTimeout(done, 1000)
        )
      })

      it('renders twice without error', done => {
        const go = () => renderPlayer({ url: test.url })
        go()
        setTimeout(go, 1000)
        setTimeout(done, 2000)
      })

      if (test.switchTo) {
        it('switches URL', done => {
          renderPlayerChange(
            { url: test.url },
            { url: test.switchTo, onPlay: () => done() }
          )
        })
      }

      if (test.error) {
        it('onError', done => {
          renderPlayer({ url: test.error, onError: () => done() })
        })
      }

      if (test.onSeek) {
        it('seekTo, onEnded', done => {
          let duration
          let seeked = false
          renderPlayer({
            url: test.url,
            onDuration: d => { duration = d },
            onProgress: p => {
              if (!seeked && duration && p.playedSeconds > 1) {
                player.seekTo(duration - 1)
                seeked = true
              }
            },
            onEnded: () => done()
          })
        })

        it('onSeek', done => {
          renderPlayer({
            url: test.url,
            onProgress: p => {
              if (p.playedSeconds >= 1) {
                player.seekTo(10)
              }
            },
            onSeek: () => done()
          })
        })

        it('seekTo fraction', done => {
          renderPlayer({
            url: test.url,
            onProgress: p => {
              if (p.playedSeconds >= 1) {
                player.seekTo(0.5)
              }
            },
            onSeek: () => done()
          })
        })

        it('seekOnPlay', done => {
          renderPlayer({
            url: test.url,
            onSeek: () => done()
          }, () => player.seekTo(3))
        })
      }
    })
  }

  describe.skip('instance methods', () => {
    beforeEach(done => {
      renderPlayer({
        url: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
        onReady: () => done()
      })
    })

    it('returns correctly', () => {
      expect(player.getInternalPlayer()).to.exist
      expect(player.getCurrentTime()).to.be.a('number')
      expect(player.getDuration()).to.be.a('number')
    })
  })

  describe('fall back to FilePlayer', () => {
    beforeEach(done => {
      renderPlayer({ url: 'http://example.com/random/path' }, () => done())
    })

    it('falls back to FilePlayer', () => {
      const video = player.getInternalPlayer()
      expect(video).to.be.a('HTMLVideoElement')
      expect(video.src).to.equal('http://example.com/random/path')
    })
  })

  describe('preloading', () => {
    beforeEach(done => {
      renderPlayer({
        url: null,
        config: {
          youtube: { preload: true },
          vimeo: { preload: true },
          dailymotion: { preload: true }
        }
      }, () => done())
    })

    it('renders with preload config', () => {
      expect(player.wrapper).to.be.a('HTMLDivElement')
      expect(player.wrapper.childNodes).to.have.length(3)
      for (let node of player.wrapper.childNodes) {
        expect(node).to.be.a('HTMLDivElement')
        expect(node.style.display).to.equal('none')
      }
    })
  })

  describe('FilePlayer tracks', () => {
    beforeEach(done => {
      renderPlayer({
        url: 'file.mp4',
        playsinline: true, // Not required but good for coverage
        config: { file: {
          tracks: [
            { kind: 'subtitles', src: 'subs/subtitles.en.vtt', srcLang: 'en', default: true },
            { kind: 'subtitles', src: 'subs/subtitles.ja.vtt', srcLang: 'ja' },
            { kind: 'subtitles', src: 'subs/subtitles.de.vtt', srcLang: 'de' }
          ]
        }}
      }, () => done())
    })

    it('renders with tracks', () => {
      expect(player.wrapper).to.be.a('HTMLDivElement')
      expect(player.wrapper.querySelectorAll('track')).to.have.length(3)
    })
  })

  // onPause being called was a bug that has been fixed
  // so skip this test for now
  it.skip('Twitch switches from video to channel', done => {
    renderPlayerChange(
      { url: 'https://www.twitch.tv/videos/106400740' },
      {
        url: 'https://www.twitch.tv/twitchdev',
        onPlay: () => done(),
        onPause: () => done()
      }
    )
  })

  it('does not error when seeking using fraction when duration is not available', done => {
    renderPlayer({
      url: 'https://www.youtube.com/watch?v=M7lc1UVf-VE',
      onReady: () => {
        player.getInternalPlayer().getDuration = () => null // Pretty hacky but it does the job
        player.seekTo(0.5)
        setTimeout(done, 1000)
      }
    })
  })

  it('canPlay returns false', () => {
    expect(ReactPlayer.canPlay('http://example.com')).to.be.false
    expect(ReactPlayer.canPlay('file.txt')).to.be.false
    expect(ReactPlayer.canPlay([ 'http://example.com', 'file.txt' ])).to.be.false
  })

  describe('wrapper prop', () => {
    it('defaults wrapper to a div', () => {
      renderPlayer({
        url: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4'
      })
      expect(player.wrapper).to.be.a('HTMLDivElement')
    })

    it('supports custom wrapper elements', () => {
      renderPlayer({
        wrapper: 'p',
        url: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4'
      })
      expect(player.wrapper).to.be.a('HTMLParagraphElement')
    })

    it('supports custom wrapper components', () => {
      const CustomWrapper = ({ children }) => <div id='test-hook' data-fake-attribute='woah'>{children}</div>
      renderPlayer({
        wrapper: CustomWrapper,
        url: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4'
      })
      const el = document.getElementById('test-hook')
      expect(el.dataset.fakeAttribute).to.equal('woah')
      expect(el.querySelectorAll('video').length).to.equal(1)
    })
  })
})
