import test from 'ava'
import { queryString } from '../../src/utils'

test('generates query string', t => {
  const object = {
    a: 1,
    b: 'abc',
    c: false
  }
  t.is(queryString(object), 'a=1&b=abc&c=false')
})
