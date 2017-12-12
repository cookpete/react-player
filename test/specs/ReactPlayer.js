/* eslint-disable no-unused-expressions */

import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'

import ReactPlayer from '../../src/ReactPlayer'

const { describe, it, expect, beforeEach, afterEach } = window

const TEST_URLS = [
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
    name: 'Vidme',
    url: 'https://vid.me/yvi',
    switchTo: 'https://vid.me/GGho'
  },
  {
    name: 'Wistia',
    url: 'https://home.wistia.com/medias/e4a27b971d',
    switchTo: 'https://home.wistia.com/medias/29b0fbf547',
    onSeek: true
  },
  {
    name: 'DailyMotion',
    url: 'http://www.dailymotion.com/video/x2buxsr',
    switchTo: 'http://www.dailymotion.com/video/x26ezj5',
    onSeek: true
  },
  {
    name: 'FilePlayer',
    url: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.ogv',
    switchTo: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
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

      it('should not play if playing is false', done => {
        render(
          <ReactPlayer
            url={test.url}
            playing={false}
            onReady={() => setTimeout(done, 1000)}
            onPlay={() => done('should not play if playing is false')}
          />,
        div)
      })

      it('plays after a delay', done => {
        const playPlayer = () => {
          render(
            <ReactPlayer
              url={test.url}
              playing
              onPlay={() => done()}
            />,
          div)
        }
        render(
          <ReactPlayer
            playing={false}
            url={test.url}
            onReady={() => setTimeout(playPlayer, 3000)}
          />,
        div)
      })

      it('volume change does not error', done => {
        const changeVolume = () => {
          render(
            <ReactPlayer
              url={test.url}
              playing
              volume={0.5}
            />,
          div)
          setTimeout(done, 1000)
        }
        render(
          <ReactPlayer
            url={test.url}
            playing
            volume={1}
            onProgress={p => {
              if (p.playedSeconds >= 3) {
                changeVolume()
              }
            }}
          />,
        div)
      })

      it('muted change does not error', done => {
        const changeMuted = () => {
          render(
            <ReactPlayer
              url={test.url}
              playing
              muted
            />,
          div)
          setTimeout(done, 1000)
        }
        render(
          <ReactPlayer
            url={test.url}
            playing
            muted={false}
            onProgress={p => {
              if (p.playedSeconds >= 3) {
                changeMuted()
              }
            }}
          />,
        div)
      })

      it('playbackRate change does not error', done => {
        const changePlaybackRate = () => {
          render(
            <ReactPlayer
              url={test.url}
              playing
              playbackRate={0.5}
            />,
          div)
          setTimeout(done, 1000)
        }
        render(
          <ReactPlayer
            url={test.url}
            playing
            playbackRate={1}
            onProgress={p => {
              if (p.playedSeconds >= 3) {
                changePlaybackRate()
              }
            }}
          />,
        div)
      })

      it('renders twice without error', done => {
        let count = 0
        const onReady = () => {
          count++
          if (count > 1) {
            done('Should not call onReady more than once')
          }
        }
        const renderPlayer = () => {
          render(<ReactPlayer url={test.url} playing onReady={onReady} />, div)
        }
        renderPlayer()
        setTimeout(renderPlayer, 1000)
        setTimeout(done, 3000)
      })

      if (test.switchTo) {
        it('switches URL', done => {
          const switchPlayer = () => {
            render(
              <ReactPlayer
                url={test.switchTo}
                playing
                onPlay={() => done()}
              />,
            div)
          }
          render(
            <ReactPlayer
              url={test.url}
              playing
              onProgress={p => {
                if (p.playedSeconds >= 3) {
                  switchPlayer()
                }
              }}
            />,
          div)
        })
      }

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

      it('seekTo, onEnded', done => {
        let player
        let duration
        let seeked = false
        render(
          <ReactPlayer
            ref={p => { player = p || player }}
            url={test.url}
            playing
            onDuration={d => { duration = d }}
            onProgress={p => {
              if (!seeked && duration && p.playedSeconds >= 3) {
                player.seekTo(duration - 3)
                seeked = true
              }
            }}
            onEnded={() => done()}
          />,
        div)
      })

      if (test.onSeek) {
        it('onSeek', done => {
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

        it('seekTo fraction', done => {
          let player
          render(
            <ReactPlayer
              ref={p => { player = p || player }}
              url={test.url}
              playing
              onProgress={p => {
                if (p.playedSeconds >= 3) {
                  player.seekTo(0.5)
                }
              }}
              onSeek={() => done()}
            />,
          div)
        })

        it('seekOnPlay', done => {
          let player
          render(
            <ReactPlayer
              ref={p => {
                player = p || player
                player.seekTo(3)
              }}
              url={test.url}
              playing
              onSeek={() => done()}
            />,
          div)
        })
      }

      if (test.name === 'Vidme') {
        it('plays a specific format', done => {
          render(
            <ReactPlayer
              url='https://vid.me/GGho'
              config={{ vidme: { format: '240p' } }}
              onReady={() => done()}
            />,
          div)
        })

        it('ignores an unknown format', done => {
          render(
            <ReactPlayer
              url='https://vid.me/GGho'
              config={{ vidme: { format: 'test-unknown-format' } }}
              onReady={() => done()}
            />,
          div)
        })
      }
    })
  }

  describe('playbackRate', () => {
    it('updates correctly', done => {
      let player
      const updatePlayer = () => {
        render(
          <ReactPlayer
            url='http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4'
            playing
            playbackRate={0.5}
            onProgress={() => {
              const p = player.getInternalPlayer()
              if (p && p.playbackRate === 0.5) {
                done()
              }
            }}
          />,
        div)
      }
      render(
        <ReactPlayer
          ref={p => { player = p }}
          url='http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4'
          playing
          onProgress={p => {
            if (p.playedSeconds >= 3) {
              updatePlayer()
            }
          }}
        />,
      div)
    })
  })

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

  describe('fall back to FilePlayer', () => {
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
          url='http://example.com/random/path'
        />,
      div)
    })

    it('falls back to FilePlayer', () => {
      const video = player.getInternalPlayer()
      expect(video).to.be.a('HTMLVideoElement')
      expect(video.src).to.equal('http://example.com/random/path')
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
      for (let node of player.wrapper.childNodes) {
        expect(node).to.be.a('HTMLDivElement')
        expect(node.style.display).to.equal('none')
      }
    })
  })

  it('does not error when seeking using fraction before ready', () => {
    render(
      <ReactPlayer
        ref={p => {
          if (p) p.seekTo(0.5)
        }}
        url='http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4'
        playing
      />,
    div)
  })

  it('canPlay returns false', () => {
    expect(ReactPlayer.canPlay('http://example.com')).to.be.false
    expect(ReactPlayer.canPlay('file.txt')).to.be.false
  })
})
