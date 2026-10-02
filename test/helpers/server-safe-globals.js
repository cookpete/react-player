// Load zora before the `window` shim below, so it starts in Node mode rather than waiting for a
// browser `load` event.
import 'zora';

// Prevent from Node.Timeout to hang the process
const oldSetTimeout = globalThis.setTimeout;
// @ts-ignore
globalThis.setTimeout = (callback, delay) => {
  const timeout = oldSetTimeout(callback, delay);
  oldSetTimeout(() => {
    timeout.unref();
  }, 100);
};

class Element extends EventTarget {
  style = {};
  querySelector = () => new Element();
  contains = () => true;
  setAttribute() {}
}

class HTMLVideoElement extends Element {
  #attrs = {
    muted: false,
    src: '',
  };

  constructor() {
    super();
    this.paused = true;
    this.volume = 1;
    this.currentTime = 0;
    this.duration = NaN;
    this.playbackRate = 1;
  }

  setAttribute(name, value) {
    if (name === 'src') {
      this.#attrs.src = value;
      this.load();
    } else {
      this.#attrs[name] = value;
    }
  }

  getAttribute(name) {
    return this.#attrs[name];
  }

  get src() {
    return this.getAttribute('src');
  }

  set src(value) {
    this.setAttribute('src', value);
  }

  get muted() {
    return this.getAttribute('muted');
  }

  set muted(value) {
    this.setAttribute('muted', !!value);
  }

  async load() {
    await Promise.resolve();
    this.dispatchEvent(new Event('loadstart'));

    await Promise.resolve();
    this.duration = 10;
    this.dispatchEvent(new Event('durationchange'));
    this.dispatchEvent(new Event('loadedmetadata'));
    this.dispatchEvent(new Event('loadeddata'));
    this.dispatchEvent(new Event('canplay'));
  }

  pause() {
    this.paused = true;
    this.dispatchEvent(new Event('pause'));
  }

  async play() {
    this.paused = false;
    this.dispatchEvent(new Event('play'));
    await Promise.resolve();
    this.dispatchEvent(new Event('playing'));
  }
}

class MediaStream {}

const document = {
  head: new Element(),
  body: new Element(),
  createElement: (type) => {
    if (type === 'video') {
      return new HTMLVideoElement();
    }
    return new Element();
  },
  getElementById: () => new Element(),
};

const globalThisShim = {
  location: { origin: 'origin' },
  navigator: { userAgent: 'node' },
  URL: class extends URL {
    static createObjectURL = () => 'mockObjectURL';
  },
  document,
  MediaStream,
};

globalThis.window = globalThisShim;
// defineProperty rather than assignment: Node 21+ defines `navigator` as a getter-only global.
Object.defineProperties(
  globalThis,
  Object.fromEntries(
    Object.entries(globalThisShim).map(([key, value]) => [
      key,
      { value, writable: true, configurable: true },
    ])
  )
);
