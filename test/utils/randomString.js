import test from 'ava'
import { randomString } from '../../src/utils'

test('returns a 5 character string', t => {
  t.is(typeof randomString(), 'string')
  t.is(randomString().length, 5)
})

test('returns different strings', t => {
  const a = randomString()
  const b = randomString()
  const c = randomString()
  t.not(a, b)
  t.not(a, c)
  t.not(b, c)
})
