import FilePlayer from './FilePlayer'

const RESOLVE_URL = 'https://api.streamable.com/videos/'
const MATCH_URL = /^https?:\/\/streamable.com\/([a-z0-9]+)$/

const cache = {} // Cache song data requests

export default class Streamable extends FilePlayer {
  static displayName = 'Streamable'
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
          onError(new Error('Streamable track could not be resolved'))
        }
      })
  }
  load (url) {
    const { onError } = this.props
    this.stop()
    this.getData(url).then(data => {
      if (!this.mounted) return
      this.player.src = data.files.mp4.url
    }, onError)
  }
}
