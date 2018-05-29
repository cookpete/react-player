import test from 'ava'
import { omit } from '../../src/utils'

const object = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5
}

test('omits properties from an object', t => {
  t.deepEqual(omit(object, ['a', 'b', 'c']), {
    d: 4,
    e: 5
  })
})

test('handles multiple array parameters', t => {
  t.deepEqual(omit(object, ['a'], ['b'], ['c']), {
    d: 4,
    e: 5
  })
})
