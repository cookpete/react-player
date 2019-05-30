import test from 'ava'
import sinon from 'sinon'
import { getSDK } from '../../src/utils'

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

global.window = {}

test.beforeEach(t => {
  window.SDK = null
  window.SDKReady = null
})

test('loads script', async t => {
  const loadScriptOverride = sinon.fake(async (url, cb) => {
    await delay(100)
    window.SDK = 'sdk'
    cb()
  })
  const sdk = await getSDK('http://example.com/abc.js', 'SDK', undefined, undefined, loadScriptOverride)
  t.is(sdk, 'sdk')
  t.true(loadScriptOverride.calledOnce)
})

test('throws on error', async t => {
  const loadScriptOverride = sinon.fake(async (url, cb) => {
    await delay(100)
    cb(new Error('Load error'))
  })
  await t.throws(getSDK('http://example.com/throws.js', 'SDK', undefined, undefined, loadScriptOverride))
  t.true(loadScriptOverride.calledOnce)
})

test('does not fetch again when loaded', async t => {
  const loadScriptOverride = sinon.fake()
  window.SDK = 'sdk'
  const sdk = await getSDK('http://example.com/def.js', 'SDK', undefined, undefined, loadScriptOverride)
  t.is(sdk, 'sdk')
  t.true(loadScriptOverride.notCalled)
})

test('does not fetch again when loading', async t => {
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

test.skip('waits for sdkReady callback', async t => {
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

test('multiple sdkReady callbacks', async t => {
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
