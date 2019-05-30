import test from 'ava'
import sinon from 'sinon'
import { getConfig } from '../../src/utils'

test('merges configs', t => {
  const defaultProps = {
    config: {
      youtube: {
        playerVars: {
          autoplay: 0,
          playsinline: 1
        },
        preload: false
      }
    }
  }
  const props = {
    config: {
      youtube: {
        playerVars: {
          playsinline: 0,
          showinfo: 1
        },
        preload: true
      }
    }
  }
  const config = getConfig(props, defaultProps)
  t.deepEqual(config, {
    youtube: {
      playerVars: {
        autoplay: 0,
        playsinline: 0,
        showinfo: 1
      },
      preload: true
    }
  })
})

test('converts old style config', t => {
  const stub = sinon.stub(console, 'warn')
  const props = {
    config: {},
    youtubeConfig: {
      playerVars: {
        playsinline: 0,
        showinfo: 1
      },
      preload: true
    }
  }
  const config = getConfig(props, { config: {} }, true)
  t.deepEqual(config, {
    youtube: {
      playerVars: {
        playsinline: 0,
        showinfo: 1
      },
      preload: true
    }
  })
  t.true(stub.calledOnce)
  stub.restore()
})
