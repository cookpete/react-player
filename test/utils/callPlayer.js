import test from 'ava'
import sinon from 'sinon'
import { callPlayer } from '../../src/utils'

test('calls a player method', t => {
  const fakePlayer = {
    player: {
      testMethod: () => 'result'
    }
  }
  t.is(callPlayer.call(fakePlayer, 'testMethod'), 'result')
})

test('returns null when player is not available', t => {
  const stub = sinon.stub(console, 'warn')
  const fakePlayer = {
    constructor: {
      displayName: 'TestPlayer'
    },
    player: null
  }
  t.is(callPlayer.call(fakePlayer, 'testMethod'), null)
  t.true(stub.calledOnce)
  stub.restore()
})

test('returns null when method is not available', t => {
  const stub = sinon.stub(console, 'warn')
  const fakePlayer = {
    constructor: {
      displayName: 'TestPlayer'
    },
    player: {
      testMethod: null
    }
  }
  t.is(callPlayer.call(fakePlayer, 'testMethod'), null)
  t.true(stub.calledOnce)
  stub.restore()
})
