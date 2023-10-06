import { test } from 'zora'
import sinon from 'sinon'
import { getSDK } from '../../src/utils'

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

globalThis.window = {}

const beforeEach = () => {
  window.SDK = null
  window.SDKReady = null
}

test('serial', async t => {
  await t.test('loads script', async t => {
    beforeEach()
    const loadScriptOverride = sinon.fake(async (url, cb) => {
      await delay(15)
      window.SDK = 'sdk'
      cb()
    })
    const sdk = await getSDK('http://example.com/abc.js', 'SDK', undefined, undefined, loadScriptOverride)
    t.is(sdk, 'sdk')
    t.ok(loadScriptOverride.calledOnce)
  })

  await t.test('throws on error', async t => {
    beforeEach()
    const loadScriptOverride = sinon.fake(async (url, cb) => {
      await delay(15)
      cb(new Error('Load error'))
    })
    try {
      await getSDK('http://example.com/throws.js', 'SDK', undefined, undefined, loadScriptOverride)
      t.fail('Should throw')
    } catch (err) {
      t.is(err.message, 'Load error')
    }
    t.ok(loadScriptOverride.calledOnce)
  })

  await t.test('does not fetch again when loaded', async t => {
    beforeEach()
    const loadScriptOverride = sinon.fake()
    window.SDK = 'sdk'
    const sdk = await getSDK('http://example.com/def.js', 'SDK', undefined, undefined, loadScriptOverride)
    t.is(sdk, 'sdk')
    t.ok(loadScriptOverride.notCalled)
  })

  await t.test('does not fetch again when loading', async t => {
    beforeEach()
    const loadScriptOverride = sinon.fake(async (url, cb) => {
      await delay(15)
      window.SDK = 'sdk'
      cb()
    })
    const result = await Promise.all([
      getSDK('http://example.com/ghi.js', 'SDK', undefined, undefined, loadScriptOverride),
      getSDK('http://example.com/ghi.js', 'SDK', undefined, undefined, loadScriptOverride)
    ])
    t.is(result[0], 'sdk')
    t.is(result[1], 'sdk')
    t.ok(loadScriptOverride.calledOnce)
  })

  await t.test('does fetch again after fetch error', async t => {
    beforeEach()
    const loadScriptOverrideError = sinon.fake(async (url, cb) => {
      await delay(15)
      cb(new Error('Load error'))
    })
    const loadScriptOverride = sinon.fake(async (url, cb) => {
      await delay(15)
      window.SDK = 'sdk'
      cb()
    })
    try {
      await getSDK('http://example.com/pqr.js', 'SDK', undefined, undefined, loadScriptOverrideError)
      t.fail('Should throw')
    } catch (err) {
      t.is(err.message, 'Load error')
    }
    const sdk = await getSDK('http://example.com/pqr.js', 'SDK', undefined, undefined, loadScriptOverride)
    t.is(sdk, 'sdk')
    t.ok(loadScriptOverrideError.calledOnce)
    t.ok(loadScriptOverride.calledOnce)
  })

  await t.test('waits for sdkReady callback', async t => {
    beforeEach()
    const loadScriptOverride = sinon.fake(async (url, cb) => {
      cb()
      await delay(15)
      window.SDK = 'sdk'
      window.SDKReady() // This doesn't work for some reason?
    })
    const sdk = await getSDK('http://example.com/jkl.js', 'SDK', 'SDKReady', undefined, loadScriptOverride)
    t.is(sdk, 'sdk')
    t.ok(loadScriptOverride.calledOnce)
  })

  await t.test('multiple sdkReady callbacks', async t => {
    beforeEach()
    const loadScriptOverride = sinon.fake(async (url, cb) => {
      cb()
      await delay(15)
      window.SDK = 'sdk'
      window.SDKReady()
    })
    const result = await Promise.all([
      await getSDK('http://example.com/mno.js', 'SDK', 'SDKReady', undefined, loadScriptOverride),
      await getSDK('http://example.com/mno.js', 'SDK', 'SDKReady', undefined, loadScriptOverride)
    ])
    t.is(result[0], 'sdk')
    t.is(result[1], 'sdk')
    t.ok(loadScriptOverride.calledOnce)
  })
})
