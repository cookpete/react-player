import { test } from 'zora'
import sinon from 'sinon'
import React from 'react'
import { create } from 'react-test-renderer'
import '../helpers/server-safe-globals'
import { containsMatchingElement } from '../helpers/helpers'
import { defaultProps } from '../../src/props'
import { getSDK as originalGetSDK } from '../../src/utils'
import FilePlayer from '../../src/players/FilePlayer'

test.skip = (name) => console.log(`Skipped ${name}`)

const config = defaultProps.config.file

const setProps = (wrapper, props) => {
  const current = wrapper.toTree()
  wrapper.update(React.createElement(current.type, {
    ...current.props,
    ...props
  }))
}

const render = (comp) => {
  return create(comp, {
    createNodeMock: () => ({
      addEventListener: () => null,
      removeEventListener: () => null,
      setAttribute: () => null,
      removeAttribute: () => null
    })
  })
}

test('listeners', t => {
  const addListeners = sinon.spy(FilePlayer.prototype, 'addListeners')
  const removeListeners = sinon.spy(FilePlayer.prototype, 'removeListeners')
  const wrapper = render(
    <FilePlayer url='file.mp4' config={config} playsinline />
  )
  t.ok(addListeners.calledOnce)
  t.ok(removeListeners.notCalled)
  wrapper.getInstance().prevPlayer = { removeEventListener: () => null }
  setProps(wrapper, { url: 'file.mp3' })
  t.ok(addListeners.calledTwice)
  wrapper.unmount()
  t.ok(removeListeners.calledTwice)
})

test('onSeek', t => {
  const onSeek = sinon.fake()
  const instance = render(<FilePlayer url='file.mp4' config={config} onSeek={onSeek} />).getInstance()
  instance.onSeek({ target: { currentTime: 10 } })
  t.ok(onSeek.calledOnceWith(10))
})

test('load - hls', async t => {
  class Hls {
    static Events = { ERROR: 'ERROR' }
    on = () => null
    loadSource = () => null
    attachMedia = () => null
  }
  const url = 'file.m3u8'
  const getSDK = sinon.stub(originalGetSDK, 'stub').resolves(Hls)
  const onLoaded = () => t.ok(true)
  const instance = render(<FilePlayer url={url} config={config} onLoaded={onLoaded} />).getInstance()
  instance.load(url)
  t.ok(getSDK.calledOnce)
  getSDK.restore()
})

test('onError - hls', t => {
  return new Promise(resolve => {
    const onError = () => {
      t.ok(true)
      resolve()
    }
    class Hls {
      static Events = { ERROR: 'ERROR' }
      on = (event, cb) => {
        if (event === 'ERROR') {
          setTimeout(cb, 100)
        }
      }

      loadSource = () => null
      attachMedia = () => null
    }
    const url = 'file.m3u8'
    const getSDK = sinon.stub(originalGetSDK, 'stub').resolves(Hls)
    const onLoaded = () => null
    const instance = render(
      <FilePlayer url={url} config={config} onLoaded={onLoaded} onError={onError} />
    ).getInstance()
    instance.load(url)
    getSDK.restore()
  })
})

test('onError - flv', t => {
  return new Promise(resolve => {
    const onError = () => {
      t.ok(true)
      resolve()
    }

    class FlvPlayer {
      attachMediaElement () {

      };

      on = (event, cb) => {
        if (event === 'error') {
          setTimeout(cb, 100)
        }
      }

      load = () => {}
    }

    class flvjs {
      static Events = { ERROR: 'error' }

      loadSource = () => null
      attachMedia = () => null
      static createPlayer = () => new FlvPlayer()
    }
    const url = 'file.flv'
    const getSDK = sinon.stub(originalGetSDK, 'stub').resolves(flvjs)
    const onLoaded = () => null
    const instance = render(
      <FilePlayer url={url} config={config} onLoaded={onLoaded} onError={onError} />
    ).getInstance()
    instance.load(url)
    getSDK.restore()
  })
})

test('load - dash', async t => {
  const dashjs = {
    MediaPlayer: () => ({
      create: () => ({
        on: () => null,
        initialize: () => null,
        getDebug: () => ({
          setLogToBrowserConsole: () => null
        }),
        updateSettings: () => null
      })
    }),
    Debug: {
      LOG_LEVEL_NONE: 0
    }
  }
  const url = 'file.mpd'
  const getSDK = sinon.stub(originalGetSDK, 'stub').resolves(dashjs)
  const onLoaded = () => t.ok(true)
  const instance = render(<FilePlayer url={url} config={config} onLoaded={onLoaded} />).getInstance()
  instance.load(url)
  t.ok(getSDK.calledOnce)
  getSDK.restore()
})

test('load - MediaStream', t => {
  const url = new globalThis.MediaStream()
  const instance = render(<FilePlayer url={url} config={config} />).getInstance()
  instance.load(url)
  t.ok(instance.player.srcObject === url)
  t.falsy(instance.player.src)
})

test('load - MediaStream (srcObject not supported)', t => {
  const url = new globalThis.MediaStream()
  const instance = render(<FilePlayer url={url} config={config} />).getInstance()
  Object.defineProperty(instance.player, 'srcObject', {
    get: () => null,
    set: () => {
      throw new Error('Browser does not support srcObject')
    }
  })
  instance.load(url)
  t.ok(instance.player.src === 'mockObjectURL')
  t.falsy(instance.player.srcObject)
})

test('load - Blob URI', t => {
  const url = 'blob:http://example.com:ceeed153-91f1-4456-a4a7-cb4085810cc4"'
  const wrapper = render(<FilePlayer url={url} config={config} />)

  t.ok(containsMatchingElement(wrapper,
    <video src={url}>{false}{[]}</video>
  ))
})

test('forceVideo', t => {
  const wrapper = render(
    <FilePlayer
      url='file.mp3' config={{
        ...config,
        forceVideo: true
      }}
    />
  )
  t.ok(containsMatchingElement(wrapper,
    <video src='file.mp3'>{false}{[]}</video>
  ))
})

test('forceAudio', t => {
  const wrapper = render(
    <FilePlayer
      url='file.mp4' config={{
        ...config,
        forceAudio: true
      }}
    />
  )
  t.ok(containsMatchingElement(wrapper,
    <audio src='file.mp4'>{false}{[]}</audio>
  ))
})

test('render video poster', t => {
  const wrapper = render(
    <FilePlayer
      url='file.mp3' config={{
        ...config,
        attributes: { poster: 'poster.png' }
      }}
    />
  )
  t.ok(containsMatchingElement(wrapper,
    <video src='file.mp3' poster='poster.png'>{false}{[]}</video>
  ))
})

test('play()', t => {
  const instance = render(<FilePlayer url='file.mp4' config={config} />).getInstance()
  instance.player.play = sinon.fake()
  instance.play()
  t.ok(instance.player.play.calledOnce)
})

test('play() - promise', t => {
  const onError = () => t.ok(true)
  const instance = render(<FilePlayer url='file.mp4' config={config} onError={onError} />).getInstance()
  instance.player.play = sinon.fake.returns({ catch: cb => cb() })
  instance.play()
  t.ok(instance.player.play.calledOnce)
})

test('pause()', t => {
  const instance = render(<FilePlayer url='file.mp4' config={config} />).getInstance()
  instance.player.pause = sinon.fake()
  instance.pause()
  t.ok(instance.player.pause.calledOnce)
})

test('stop()', t => {
  const instance = render(<FilePlayer url='file.mp4' config={config} />).getInstance()
  instance.player.removeAttribute = sinon.fake()
  instance.stop()
  t.ok(instance.player.removeAttribute.calledOnceWith('src'))
})

test('stop() - dash', t => {
  const instance = render(<FilePlayer url='file.mpd' config={config} />).getInstance()
  instance.dash = { reset: sinon.fake() }
  instance.stop()
  t.ok(instance.dash.reset.calledOnce)
})

test('seekTo()', t => {
  const instance = render(<FilePlayer url='file.mp4' config={config} />).getInstance()
  instance.seekTo(10)
  t.ok(instance.player.currentTime === 10)
})

test('setVolume()', t => {
  const instance = render(<FilePlayer url='file.mp4' config={config} />).getInstance()
  instance.setVolume(0.5)
  t.ok(instance.player.volume === 0.5)
})

test('mute()', t => {
  const instance = render(<FilePlayer url='file.mp4' config={config} />).getInstance()
  instance.mute()
  t.ok(instance.player.muted)
})

test('unmute()', t => {
  const instance = render(<FilePlayer url='file.mp4' config={config} />).getInstance()
  instance.unmute()
  t.notOk(instance.player.muted)
})

test('setPlaybackRate()', t => {
  const instance = render(<FilePlayer url='file.mp4' config={config} />).getInstance()
  instance.setPlaybackRate(0.5)
  t.ok(instance.player.playbackRate === 0.5)
})

test('getDuration()', t => {
  const instance = render(<FilePlayer url='file.mp4' config={config} />).getInstance()
  instance.player.duration = 10
  t.ok(instance.getDuration() === 10)
})

test('getCurrentTime()', t => {
  const instance = render(<FilePlayer url='file.mp4' config={config} />).getInstance()
  instance.player.currentTime = 5
  t.ok(instance.getCurrentTime() === 5)
})

test('getSecondsLoaded()', t => {
  const instance = render(<FilePlayer url='file.mp4' config={config} />).getInstance()
  instance.player.buffered = []
  t.ok(instance.getSecondsLoaded() === 0)
  instance.player.buffered = { end: () => 10 }
  instance.player.duration = 20
  t.ok(instance.getSecondsLoaded() === 10)
  instance.player.duration = 5
  t.ok(instance.getSecondsLoaded() === 5)
})

test('render - video', t => {
  const wrapper = render(<FilePlayer url='file.mp4' config={config} />)
  t.ok(containsMatchingElement(wrapper,
    <video src='file.mp4'>{false}{[]}</video>
  ))
})

test('render - audio', t => {
  const wrapper = render(<FilePlayer url='file.mp3' config={config} />)
  t.ok(containsMatchingElement(wrapper,
    <audio src='file.mp3'>{false}{[]}</audio>
  ))
})

test('render - hls', t => {
  const wrapper = render(<FilePlayer url='file.m3u8' config={config} />)
  t.ok(containsMatchingElement(wrapper,
    <video src={undefined}>{false}{[]}</video>
  ))
})

test('render - dash', t => {
  const wrapper = render(<FilePlayer url='file.mpd' config={config} />)
  t.ok(containsMatchingElement(wrapper,
    <video src={undefined}>{false}{[]}</video>
  ))
})

test('render - dropbox', t => {
  const url = 'https://www.dropbox.com/s/abc/file.mp4'
  const wrapper = render(<FilePlayer url={url} config={config} />)
  t.ok(containsMatchingElement(wrapper,
    <video src='https://dl.dropboxusercontent.com/s/abc/file.mp4'>
      {false}{[]}
    </video>
  ))
})

test('render - string array', t => {
  const url = ['file.mp4', 'file.ogg']
  const wrapper = render(<FilePlayer url={url} config={config} />)
  t.ok(containsMatchingElement(wrapper,
    <video src={undefined}>
      {[
        <source key={0} src='file.mp4' />,
        <source key={1} src='file.ogg' />
      ]}
      {[]}
    </video>
  ))
})

test('render - object array', t => {
  const url = [
    { src: 'file.mp4', type: 'video/mp4', media: '(max-width:800px)' },
    { src: 'file.mp4', type: 'video/mp4' },
    { src: 'file.ogg', type: 'video/ogg' }
  ]
  const wrapper = render(<FilePlayer url={url} config={config} />)
  t.ok(containsMatchingElement(wrapper,
    <video src={undefined}>
      {[
        <source key={0} src='file.mp4' type='video/mp4' media='(max-width:800px)' />,
        <source key={1} src='file.mp4' type='video/mp4' />,
        <source key={1} src='file.ogg' type='video/ogg' />
      ]}
      {[]}
    </video>
  ))
})

test.skip('render tracks', t => {
  const wrapper = render(
    <FilePlayer
      url='file.mp4' config={{
        file: {
          ...config.file,
          tracks: [
            { kind: 'subtitles', src: 'subtitles.en.vtt', srcLang: 'en', default: true },
            { kind: 'subtitles', src: 'subtitles.ja.vtt', srcLang: 'ja' }
          ]
        }
      }}
    />
  )
  t.ok(containsMatchingElement(wrapper,
    <video src='file.mp4'>
      {false}
      {[
        <track key={0} kind='subtitles' src='subtitles.en.vtt' srcLang='en' default />,
        <track key={1} kind='subtitles' src='subtitles.js.vtt' srcLang='js' />
      ]}
    </video>
  ))
})

test('auto width/height', t => {
  const wrapper = render(
    <FilePlayer url='file.mp4' config={config} width='auto' height='auto' />
  )
  t.ok(containsMatchingElement(wrapper,
    <video src='file.mp4' style={{ width: 'auto', height: 'auto' }}>
      {false}{[]}
    </video>
  ))
})

test('clear srcObject on url change', t => {
  const url = new globalThis.MediaStream()
  const wrapper = render(<FilePlayer url={url} config={config} />)
  const instance = wrapper.getInstance()
  instance.load(url)
  setProps(wrapper, { url: 'file.mpv' })
  t.is(instance.player.srcObject, null)
})
