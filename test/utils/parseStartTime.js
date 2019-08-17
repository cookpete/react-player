import test from 'ava'
import { parseStartTime } from '../../src/utils'

const YOUTUBE_URL = 'http://youtu.be/12345678901'

test('parses seconds', t => {
  t.is(parseStartTime(YOUTUBE_URL + '?start=162'), 162)
})

test('parses stamps', t => {
  t.is(parseStartTime(YOUTUBE_URL + '?start=48s'), 48)
  t.is(parseStartTime(YOUTUBE_URL + '?start=3m15s'), 195)
  t.is(parseStartTime(YOUTUBE_URL + '?start=1h36m17s'), 5777)
})

test('parses with other params', t => {
  t.is(parseStartTime(YOUTUBE_URL + '?param=1&start=32'), 32)
})

test('parses using t', t => {
  t.is(parseStartTime(YOUTUBE_URL + '?t=32'), 32)
})

test('parses using a hash', t => {
  t.is(parseStartTime(YOUTUBE_URL + '#t=32'), 32)
  t.is(parseStartTime(YOUTUBE_URL + '#start=32'), 32)
})

test('returns undefined for invalid stamps', t => {
  t.is(parseStartTime(YOUTUBE_URL), undefined)
  t.is(parseStartTime(YOUTUBE_URL + '?start='), undefined)
  t.is(parseStartTime(YOUTUBE_URL + '?start=hms'), undefined)
  t.is(parseStartTime(YOUTUBE_URL + '?start=invalid'), undefined)
  t.is(parseStartTime(YOUTUBE_URL + '?strat=32'), undefined)
  t.is(parseStartTime(YOUTUBE_URL + '#s=32'), undefined)
})
