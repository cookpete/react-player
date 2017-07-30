import FilePlayer from './FilePlayer'

const RESOLVE_URL = 'https://api.vid.me/videoByUrl/'
const MATCH_URL = /^https?:\/\/vid.me\/([a-z0-9]+)$/i

const cache = {} // Cache song data requests

export default class Vidme extends FilePlayer {
  static displayName = 'Vidme'
  static canPlay (url) {
    return MATCH_URL.test(url)
  }
  getData (url) {
    const { onError } = this.props
    const id = url.match(MATCH_URL)[1]
    if (cache[id]) {
      return Promise.resolve(cache[id])
    }
    return window.fetch(RESOLVE_URL + id)
      .then(response => {
        if (response.status === 200) {
          cache[id] = response.json()
          return cache[id]
        } else {
          onError(new Error('Vidme track could not be resolved'))
        }
      })
  }
  getURL ({ video }) {
    const { config } = this.props
    if (config.vidme.format && video.formats && video.formats.length !== 0) {
      const index = video.formats.findIndex(f => f.type === config.vidme.format)
      if (index !== -1) {
        return video.formats[index].uri
      } else {
        console.warn(`Vidme format "${config.vidme.format}" was not found for ${video.full_url}`)
      }
    }
    return video.complete_url
  }
  load (url) {
    const { onError } = this.props
    this.stop()
    this.getData(url).then(data => {
      if (!this.mounted) return
      this.player.src = this.getURL(data)
    }, onError)
  }
}
