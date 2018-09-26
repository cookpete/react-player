import test from 'ava'
import { isEqual } from '../../src/utils'

test('returns true', t => {
  const a = {
    b: { c: 3, d: 4 },
    c: [1, 2, 3],
    d: [{ a: 1 }, { b: 2 }]
  }
  const b = {
    b: { c: 3, d: 4 },
    c: [1, 2, 3],
    d: [{ a: 1 }, { b: 2 }]
  }
  t.true(isEqual(a, b))
})

test('returns false when object size differs', t => {
  const a = {
    b: { c: 3, d: 4 }
  }
  const b = {
    b: { c: 3, d: 4 },
    c: [1, 2, 3]
  }
  t.false(isEqual(a, b))
})

test('returns false when deep property differs', t => {
  const a = {
    b: { c: 3, d: 4 },
    c: [1, 2, 3],
    d: [{ a: 1 }, { b: 2 }]
  }
  const b = {
    b: { c: 3, d: 4 },
    c: [1, 2, 3],
    d: [{ a: 1 }, { b: 3 }]
  }
  t.false(isEqual(a, b))
})

test('returns false when array size differs', t => {
  const a = {
    b: { c: 3, d: 4 },
    c: [1, 2, 3],
    d: [{ a: 1 }, { b: 2 }]
  }
  const b = {
    b: { c: 3, d: 4 },
    c: [1, 2],
    d: [{ a: 1 }, { b: 3 }]
  }
  t.false(isEqual(a, b))
})

test('ignores functions', t => {
  const a = {
    b: { c: 3, d: 4 },
    c: [1, 2, 3],
    d: [{ a: 1 }, { b: 2 }],
    e: () => {}
  }
  const b = {
    b: { c: 3, d: 4 },
    c: [1, 2, 3],
    d: [{ a: 1 }, { b: 2 }],
    e: () => {}
  }
  t.true(isEqual(a, b))
})
