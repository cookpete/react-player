import SoundCloud from '../../src/players/SoundCloud'
import YouTube from '../../src/players/YouTube'
import Vimeo from '../../src/players/Vimeo'
import FilePlayer from '../../src/players/FilePlayer'

const { describe, it, expect } = window

describe('YouTube', () => {
  it('knows what it can play', () => {
    expect(YouTube.canPlay('https://www.youtube.com/watch?v=12345678901')).to.be.true
    expect(YouTube.canPlay('http://www.youtube.com/watch?v=12345678901')).to.be.true
    expect(YouTube.canPlay('https://youtube.com/watch?v=12345678901')).to.be.true
    expect(YouTube.canPlay('http://youtube.com/watch?v=12345678901')).to.be.true
    expect(YouTube.canPlay('http://youtu.be/12345678901')).to.be.true
  })

  it('knows what it can\'t play', () => {
    expect(YouTube.canPlay('http://soundcloud.com/artist-name/title-name')).to.be.false
    expect(YouTube.canPlay('http://vimeo.com/1234')).to.be.false
  })
})

describe('SoundCloud', () => {
  it('knows what it can play', () => {
    expect(SoundCloud.canPlay('http://soundcloud.com/artist-name/title-name')).to.be.true
    expect(SoundCloud.canPlay('http://soundcloud.com/artist_name/title_name')).to.be.true
    expect(SoundCloud.canPlay('http://snd.sc/artist-name/title-name')).to.be.true
  })

  it('knows what it can\'t play', () => {
    expect(SoundCloud.canPlay('http://soundcloud.com/artist-only')).to.be.false
    expect(SoundCloud.canPlay('https://www.youtube.com/watch?v=12345678901')).to.be.false
    expect(SoundCloud.canPlay('http://vimeo.com/1234')).to.be.false
  })
})

describe('Vimeo', () => {
  it('knows what it can play', () => {
    expect(Vimeo.canPlay('http://vimeo.com/1234')).to.be.true
  })

  it('knows what it can\'t play', () => {
    expect(Vimeo.canPlay('http://soundcloud.com/artist-name/title-name')).to.be.false
    expect(Vimeo.canPlay('https://www.youtube.com/watch?v=1234')).to.be.false
  })
})

describe('FilePlayer', () => {
  it('knows what it can play', () => {
    expect(FilePlayer.canPlay('http://example.com/file.mp4')).to.be.true
    expect(FilePlayer.canPlay('http://example.com/file.ogg')).to.be.true
    expect(FilePlayer.canPlay('http://example.com/file.ogv')).to.be.true
    expect(FilePlayer.canPlay('http://example.com/file.webm')).to.be.true
    expect(FilePlayer.canPlay('http://example.com/file.mp3')).to.be.true
    expect(FilePlayer.canPlay('http://example.com/file.wav')).to.be.true
    expect(FilePlayer.canPlay('http://example.com/file.mp4?foo=1&bar=2')).to.be.true
    expect(FilePlayer.canPlay('http://example.com/file.ogg?foo=1&bar=2')).to.be.true
    expect(FilePlayer.canPlay('http://example.com/file.ogv?foo=1&bar=2')).to.be.true
    expect(FilePlayer.canPlay('http://example.com/file.webm?foo=1&bar=2')).to.be.true
    expect(FilePlayer.canPlay('http://example.com/file.mp3?foo=1&bar=2')).to.be.true
    expect(FilePlayer.canPlay('http://example.com/file.wav?foo=1&bar=2')).to.be.true
  })

  it('knows what it can\'t play', () => {
    expect(FilePlayer.canPlay('http://example.com/file.mp5')).to.be.false
    expect(FilePlayer.canPlay('http://example.com/file.ogh')).to.be.false
    expect(FilePlayer.canPlay('http://example.com/file.web')).to.be.false
    expect(FilePlayer.canPlay('http://example.com/file.txt')).to.be.false
  })
})
