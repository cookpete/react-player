import SoundCloud from '../../src/players/SoundCloud'
import YouTube from '../../src/players/YouTube'
import Vimeo from '../../src/players/Vimeo'

const { describe, it, expect } = window

describe('canPlay', () => {
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
})
