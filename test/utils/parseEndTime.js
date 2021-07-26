import test from 'ava'
import { parseEndTime } from '../../src/utils'

const YOUTUBE_URL = 'http://youtu.be/12345678901'

test('parses seconds', t => {
  t.is(parseEndTime(YOUTUBE_URL + '?end=162'), 162)
})

test('parses stamps', t => {
  t.is(parseEndTime(YOUTUBE_URL + '?end=48s'), 48)
  t.is(parseEndTime(YOUTUBE_URL + '?end=3m15s'), 195)
  t.is(parseEndTime(YOUTUBE_URL + '?end=1h36m17s'), 5777)
})

test('parses with other params', t => {
  t.is(parseEndTime(YOUTUBE_URL + '?param=1&end=32'), 32)
})

test('parses using a hash', t => {
  t.is(parseEndTime(YOUTUBE_URL + '#end=32'), 32)
})

test('returns undefined for invalid stamps', t => {
  t.is(parseEndTime(YOUTUBE_URL), undefined)
  t.is(parseEndTime(YOUTUBE_URL + '?end='), undefined)
  t.is(parseEndTime(YOUTUBE_URL + '?end=hms'), undefined)
  t.is(parseEndTime(YOUTUBE_URL + '?end=invalid'), undefined)
  t.is(parseEndTime(YOUTUBE_URL + '?strat=32'), undefined)
  t.is(parseEndTime(YOUTUBE_URL + '#s=32'), undefined)
})
