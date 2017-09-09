import { parseStartTime, randomString, omit } from '../../src/utils'

const { describe, it, expect } = window

describe('parseStartTime', () => {
  const YOUTUBE_URL = 'http://youtu.be/12345678901'

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

describe('randomString', () => {
  it('returns a 5 character string', () => {
    expect(randomString()).to.be.a('string')
    expect(randomString()).to.have.lengthOf(5)
  })

  it('returns different strings', () => {
    const a = randomString()
    const b = randomString()
    const c = randomString()
    expect(a).to.not.equal(b)
    expect(a).to.not.equal(c)
    expect(b).to.not.equal(c)
  })
})

describe('omit', () => {
  const object = {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: 5
  }

  it('omits properties from an object', () => {
    expect(omit(object, ['a', 'b', 'c'])).to.deep.equal({
      d: 4,
      e: 5
    })
  })

  it('handles multiple array parameters', () => {
    expect(omit(object, ['a'], ['b'], ['c'])).to.deep.equal({
      d: 4,
      e: 5
    })
  })
})
