import { describe, it } from 'mocha'
import { expect } from 'chai'

import { parseStartTime } from '../../src/utils'

const YOUTUBE_URL = 'http://youtu.be/12345678901'

describe('parseStartTime', () => {
  it('parses seconds', () => {
    expect(parseStartTime(YOUTUBE_URL + '?start=162')).to.equal(162)
  })

  it('parses stamps', () => {
    expect(parseStartTime(YOUTUBE_URL + '?start=48s')).to.equal(48)
    expect(parseStartTime(YOUTUBE_URL + '?start=3m15s')).to.equal(195)
    expect(parseStartTime(YOUTUBE_URL + '?start=1h36m17s')).to.equal(5777)
  })

  it('parses with other params', () => {
    expect(parseStartTime(YOUTUBE_URL + '?param=1&start=32')).to.equal(32)
  })

  it('parses using t', () => {
    expect(parseStartTime(YOUTUBE_URL + '?t=32')).to.equal(32)
  })

  it('parses using a hash', () => {
    expect(parseStartTime(YOUTUBE_URL + '#t=32')).to.equal(32)
    expect(parseStartTime(YOUTUBE_URL + '#start=32')).to.equal(32)
  })

  it('parses using a hash', () => {
    expect(parseStartTime(YOUTUBE_URL + '#t=32')).to.equal(32)
    expect(parseStartTime(YOUTUBE_URL + '#start=32')).to.equal(32)
  })

  it('returns 0 for invalid stamps', () => {
    expect(parseStartTime(YOUTUBE_URL)).to.equal(0)
    expect(parseStartTime(YOUTUBE_URL + '?start=')).to.equal(0)
    expect(parseStartTime(YOUTUBE_URL + '?start=hms')).to.equal(0)
    expect(parseStartTime(YOUTUBE_URL + '?start=invalid')).to.equal(0)
    expect(parseStartTime(YOUTUBE_URL + '?strat=32')).to.equal(0)
    expect(parseStartTime(YOUTUBE_URL + '#s=32')).to.equal(0)
  })
})
