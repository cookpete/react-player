class Element extends EventTarget {
  style = {}
  querySelector = () => new Element()
  contains = () => true
}

class MediaStream {}

const document = {
  head: new Element(),
  body: new Element(),
  createElement: () => new Element(),
  getElementById: () => new Element()
}

const globalThisShim = {
  location: { origin: 'origin' },
  navigator: {},
  URL: { createObjectURL: () => 'mockObjectURL' },
  document,
  MediaStream
}

globalThis.document = document
globalThis.window = globalThisShim
Object.assign(globalThis, globalThisShim)
