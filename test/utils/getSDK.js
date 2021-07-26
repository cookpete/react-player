import test from 'ava'
import sinon from 'sinon'
import { getSDK } from '../../src/utils'

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

global.window = {}

test.beforeEach(t => {
  window.SDK = null
  window.SDKReady = null
})

test.serial('loads script', async t => {
  const loadScriptOverride = sinon.fake(async (url, cb) => {
    await delay(100)
    window.SDK = 'sdk'
    cb()
  })
  const sdk = await getSDK('http://example.com/abc.js', 'SDK', undefined, undefined, loadScriptOverride)
  t.is(sdk, 'sdk')
  t.true(loadScriptOverride.calledOnce)
})

test.serial('throws on error', async t => {
  const loadScriptOverride = sinon.fake(async (url, cb) => {
    await delay(100)
    cb(new Error('Load error'))
  })
  await t.throwsAsync(getSDK('http://example.com/throws.js', 'SDK', undefined, undefined, loadScriptOverride))
  t.true(loadScriptOverride.calledOnce)
})

test.serial('does not fetch again when loaded', async t => {
  const loadScriptOverride = sinon.fake()
  window.SDK = 'sdk'
  const sdk = await getSDK('http://example.com/def.js', 'SDK', undefined, undefined, loadScriptOverride)
  t.is(sdk, 'sdk')
  t.true(loadScriptOverride.notCalled)
})

test.serial('does not fetch again when loading', async t => {
  const loadScriptOverride = sinon.fake(async (url, cb) => {
    await delay(100)
    window.SDK = 'sdk'
    cb()
  })
  const result = await Promise.all([
    getSDK('http://example.com/ghi.js', 'SDK', undefined, undefined, loadScriptOverride),
    getSDK('http://example.com/ghi.js', 'SDK', undefined, undefined, loadScriptOverride)
  ])
  t.is(result[0], 'sdk')
  t.is(result[1], 'sdk')
  t.true(loadScriptOverride.calledOnce)
})

test.serial('does fetch again after fetch error', async t => {
  const loadScriptOverrideError = sinon.fake(async (url, cb) => {
    await delay(100)
    cb(new Error('Load error'))
  })
  const loadScriptOverride = sinon.fake(async (url, cb) => {
    await delay(100)
    window.SDK = 'sdk'
    cb()
  })
  await t.throwsAsync(getSDK('http://example.com/pqr.js', 'SDK', undefined, undefined, loadScriptOverrideError))
  const sdk = await getSDK('http://example.com/pqr.js', 'SDK', undefined, undefined, loadScriptOverride)
  t.is(sdk, 'sdk')
  t.true(loadScriptOverrideError.calledOnce)
  t.true(loadScriptOverride.calledOnce)
})

test.serial('waits for sdkReady callback', async t => {
  const loadScriptOverride = sinon.fake(async (url, cb) => {
    cb()
    await delay(100)
    window.SDK = 'sdk'
    window.SDKReady() // This doesn't work for some reason?
  })
  const sdk = await getSDK('http://example.com/jkl.js', 'SDK', 'SDKReady', undefined, loadScriptOverride)
  t.is(sdk, 'sdk')
  t.true(loadScriptOverride.calledOnce)
})

test.serial('multiple sdkReady callbacks', async t => {
  const loadScriptOverride = sinon.fake(async (url, cb) => {
    cb()
    await delay(100)
    window.SDK = 'sdk'
    window.SDKReady()
  })
  const result = await Promise.all([
    await getSDK('http://example.com/mno.js', 'SDK', 'SDKReady', undefined, loadScriptOverride),
    await getSDK('http://example.com/mno.js', 'SDK', 'SDKReady', undefined, loadScriptOverride)
  ])
  t.is(result[0], 'sdk')
  t.is(result[1], 'sdk')
  t.true(loadScriptOverride.calledOnce)
})
