import React from 'react'
import test from 'ava'
import sinon from 'sinon'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import FilePlayer from '../../src/players/FilePlayer'
import { defaultProps } from '../../src/props'
import * as utils from '../../src/utils'

class MockMediaStream { }

global.navigator = { }
global.window = {
  MediaStream: MockMediaStream,
  URL: {
    createObjectURL: url => 'mockObjectURL'
  }
}

configure({ adapter: new Adapter() })

const config = defaultProps.config.file

test.beforeEach(t => {
  FilePlayer.prototype.componentWillMount = function () {
    this.ref({
      addEventListener: () => null,
      removeEventListener: () => null,
      setAttribute: () => null,
      removeAttribute: () => null
    })
  }
})

test.afterEach(t => {
  FilePlayer.prototype.componentWillMount = undefined
})

test('listeners', t => {
  const addListeners = sinon.spy(FilePlayer.prototype, 'addListeners')
  const removeListeners = sinon.spy(FilePlayer.prototype, 'removeListeners')
  const wrapper = shallow(
    <FilePlayer url='file.mp4' config={config} playsinline />
  )
  t.true(addListeners.calledOnce)
  t.true(removeListeners.notCalled)
  wrapper.instance().prevPlayer = { removeEventListener: () => null }
  wrapper.setProps({ url: 'file.mp3' })
  t.true(addListeners.calledTwice)
  wrapper.unmount()
  t.true(removeListeners.calledTwice)
})

test('onSeek', t => {
  const onSeek = sinon.fake()
  const instance = shallow(<FilePlayer url='file.mp4' config={config} onSeek={onSeek} />).instance()
  instance.onSeek({ target: { currentTime: 10 } })
  t.true(onSeek.calledOnceWith(10))
})

test('load - hls', async t => {
  class Hls {
    static Events = { ERROR: 'ERROR' }
    on = () => null
    loadSource = () => null
    attachMedia = () => null
  }
  const url = 'file.m3u8'
  const getSDK = sinon.stub(utils, 'getSDK').resolves(Hls)
  const onLoaded = () => t.pass()
  const instance = shallow(<FilePlayer url={url} config={config} onLoaded={onLoaded} />).instance()
  instance.load(url)
  t.true(getSDK.calledOnce)
  getSDK.restore()
})

test('onError - hls', t => {
  return new Promise(resolve => {
    const onError = () => {
      t.pass()
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
    const getSDK = sinon.stub(utils, 'getSDK').resolves(Hls)
    const onLoaded = () => null
    const instance = shallow(
      <FilePlayer url={url} config={config} onLoaded={onLoaded} onError={onError} />
    ).instance()
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
  const getSDK = sinon.stub(utils, 'getSDK').resolves(dashjs)
  const onLoaded = () => t.pass()
  const instance = shallow(<FilePlayer url={url} config={config} onLoaded={onLoaded} />).instance()
  instance.load(url)
  t.true(getSDK.calledOnce)
  getSDK.restore()
})

test('load - MediaStream', t => {
  const url = new MockMediaStream()
  const instance = shallow(<FilePlayer url={url} config={config} />).instance()
  instance.load(url)
  t.true(instance.player.srcObject === url)
  t.falsy(instance.player.src)
})

test('load - MediaStream (srcObject not supported)', t => {
  const url = new MockMediaStream()
  const instance = shallow(<FilePlayer url={url} config={config} />).instance()
  Object.defineProperty(instance.player, 'srcObject', {
    get: () => null,
    set: () => {
      throw new Error('Browser does not support srcObject')
    }
  })
  instance.load(url)
  t.true(instance.player.src === 'mockObjectURL')
  t.falsy(instance.player.srcObject)
})

test('load - Blob URI', t => {
  const url = 'blob:http://example.com:ceeed153-91f1-4456-a4a7-cb4085810cc4"'
  const wrapper = shallow(<FilePlayer url={url} config={config} />)

  t.true(wrapper.containsMatchingElement(
    <video src={url}>{false}{[]}</video>
  ))
})

test('forceVideo', t => {
  const wrapper = shallow(
    <FilePlayer
      url='file.mp3' config={{
        ...config,
        forceVideo: true
      }}
    />
  )
  t.true(wrapper.containsMatchingElement(
    <video src='file.mp3'>{false}{[]}</video>
  ))
})

test('forceAudio', t => {
  const wrapper = shallow(
    <FilePlayer
      url='file.mp4' config={{
        ...config,
        forceAudio: true
      }}
    />
  )
  t.true(wrapper.containsMatchingElement(
    <audio src='file.mp4'>{false}{[]}</audio>
  ))
})

test('render video poster', t => {
  const wrapper = shallow(
    <FilePlayer
      url='file.mp3' config={{
        ...config,
        attributes: { poster: 'poster.png' }
      }}
    />
  )
  t.true(wrapper.containsMatchingElement(
    <video src='file.mp3' poster='poster.png'>{false}{[]}</video>
  ))
})

test('play()', t => {
  const instance = shallow(<FilePlayer url='file.mp4' config={config} />).instance()
  instance.player.play = sinon.fake()
  instance.play()
  t.true(instance.player.play.calledOnce)
})

test('play() - promise', t => {
  const onError = () => t.pass()
  const instance = shallow(<FilePlayer url='file.mp4' config={config} onError={onError} />).instance()
  instance.player.play = sinon.fake.returns({ catch: cb => cb() })
  instance.play()
  t.true(instance.player.play.calledOnce)
})

test('pause()', t => {
  const instance = shallow(<FilePlayer url='file.mp4' config={config} />).instance()
  instance.player.pause = sinon.fake()
  instance.pause()
  t.true(instance.player.pause.calledOnce)
})

test('stop()', t => {
  const instance = shallow(<FilePlayer url='file.mp4' config={config} />).instance()
  instance.player.removeAttribute = sinon.fake()
  instance.stop()
  t.true(instance.player.removeAttribute.calledOnceWith('src'))
})

test('stop() - dash', t => {
  const instance = shallow(<FilePlayer url='file.mpd' config={config} />).instance()
  instance.dash = { reset: sinon.fake() }
  instance.stop()
  t.true(instance.dash.reset.calledOnce)
})

test('seekTo()', t => {
  const instance = shallow(<FilePlayer url='file.mp4' config={config} />).instance()
  instance.seekTo(10)
  t.true(instance.player.currentTime === 10)
})

test('setVolume()', t => {
  const instance = shallow(<FilePlayer url='file.mp4' config={config} />).instance()
  instance.setVolume(0.5)
  t.true(instance.player.volume === 0.5)
})

test('mute()', t => {
  const instance = shallow(<FilePlayer url='file.mp4' config={config} />).instance()
  instance.mute()
  t.true(instance.player.muted)
})

test('unmute()', t => {
  const instance = shallow(<FilePlayer url='file.mp4' config={config} />).instance()
  instance.unmute()
  t.false(instance.player.muted)
})

test('setPlaybackRate()', t => {
  const instance = shallow(<FilePlayer url='file.mp4' config={config} />).instance()
  instance.setPlaybackRate(0.5)
  t.true(instance.player.playbackRate === 0.5)
})

test('getDuration()', t => {
  const instance = shallow(<FilePlayer url='file.mp4' config={config} />).instance()
  instance.player.duration = 10
  t.true(instance.getDuration() === 10)
})

test('getCurrentTime()', t => {
  const instance = shallow(<FilePlayer url='file.mp4' config={config} />).instance()
  instance.player.currentTime = 5
  t.true(instance.getCurrentTime() === 5)
})

test('getSecondsLoaded()', t => {
  const instance = shallow(<FilePlayer url='file.mp4' config={config} />).instance()
  instance.player.buffered = []
  t.true(instance.getSecondsLoaded() === 0)
  instance.player.buffered = { end: () => 10 }
  instance.player.duration = 20
  t.true(instance.getSecondsLoaded() === 10)
  instance.player.duration = 5
  t.true(instance.getSecondsLoaded() === 5)
})

test('render - video', t => {
  const wrapper = shallow(<FilePlayer url='file.mp4' config={config} />)
  t.true(wrapper.containsMatchingElement(
    <video src='file.mp4'>{false}{[]}</video>
  ))
})

test('render - audio', t => {
  const wrapper = shallow(<FilePlayer url='file.mp3' config={config} />)
  t.true(wrapper.containsMatchingElement(
    <audio src='file.mp3'>{false}{[]}</audio>
  ))
})

test('render - hls', t => {
  const wrapper = shallow(<FilePlayer url='file.m3u8' config={config} />)
  t.true(wrapper.containsMatchingElement(
    <video src={undefined}>{false}{[]}</video>
  ))
})

test('render - dash', t => {
  const wrapper = shallow(<FilePlayer url='file.mpd' config={config} />)
  t.true(wrapper.containsMatchingElement(
    <video src={undefined}>{false}{[]}</video>
  ))
})

test('render - dropbox', t => {
  const url = 'https://www.dropbox.com/s/abc/file.mp4'
  const wrapper = shallow(<FilePlayer url={url} config={config} />)
  t.true(wrapper.containsMatchingElement(
    <video src='https://dl.dropboxusercontent.com/s/abc/file.mp4'>
      {false}{[]}
    </video>
  ))
})

test('render - string array', t => {
  const url = ['file.mp4', 'file.ogg']
  const wrapper = shallow(<FilePlayer url={url} config={config} />)
  t.true(wrapper.containsMatchingElement(
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
    { src: 'file.mp4', type: 'video/mp4' },
    { src: 'file.ogg', type: 'video/ogg' }
  ]
  const wrapper = shallow(<FilePlayer url={url} config={config} />)
  t.true(wrapper.containsMatchingElement(
    <video src={undefined}>
      {[
        <source key={0} src='file.mp4' type='video/mp4' />,
        <source key={1} src='file.ogg' type='video/ogg' />
      ]}
      {[]}
    </video>
  ))
})

test.skip('render tracks', t => {
  const wrapper = shallow(
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
  t.true(wrapper.containsMatchingElement(
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
  const wrapper = shallow(
    <FilePlayer url='file.mp4' config={config} width='auto' height='auto' />
  )
  t.true(wrapper.containsMatchingElement(
    <video src='file.mp4' style={{ width: 'auto', height: 'auto' }}>
      {false}{[]}
    </video>
  ))
})

test('clear srcObject on url change', t => {
  const url = new MockMediaStream()
  const wrapper = shallow(<FilePlayer url={url} config={config} />)
  const instance = wrapper.instance()
  instance.load(url)
  wrapper.setProps({ url: 'file.mpv' })
  t.is(instance.player.srcObject, null)
})
