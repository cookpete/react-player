/* eslint-disable no-unused-expressions */

import SoundCloud from '../../src/players/SoundCloud'
import YouTube from '../../src/players/YouTube'
import Vimeo from '../../src/players/Vimeo'
import Wistia from '../../src/players/Wistia'

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
      expect(Vimeo.canPlay('https://vimeo.com/1234')).to.be.true
    })

    it('knows what it can\'t play', () => {
      expect(Vimeo.canPlay('http://soundcloud.com/artist-name/title-name')).to.be.false
      expect(Vimeo.canPlay('https://www.youtube.com/watch?v=1234')).to.be.false
    })
  })

  describe('Wistia', () => {
    it('knows what it can play', () => {
      expect(Wistia.canPlay('https://fast.wistia.com/medias/e4a27b971d')).to.be.true
      expect(Wistia.canPlay('http://fast.wistia.com/medias/e4a27b971d')).to.be.true
      expect(Wistia.canPlay('https://fast.wi.st/medias/e4a27b971d')).to.be.true
      expect(Wistia.canPlay('http://fast.wi.st/medias/e4a27b971d')).to.be.true
      expect(Wistia.canPlay('https://fast.wistia.com/embed/e4a27b971d')).to.be.true
      expect(Wistia.canPlay('http://fast.wistia.com/embed/e4a27b971d')).to.be.true
      expect(Wistia.canPlay('https://fast.wi.st/embed/e4a27b971d')).to.be.true
      expect(Wistia.canPlay('http://fast.wi.st/embed/e4a27b971d')).to.be.true
    })

    it('knows what it can\'t play', () => {
      expect(Wistia.canPlay('http://soundcloud.com/artist-name/title-name')).to.be.false
      expect(Wistia.canPlay('http://vimeo.com/1234')).to.be.false
      expect(Wistia.canPlay('https://www.youtube.com/watch?v=1234')).to.be.false
    })
  })
})
