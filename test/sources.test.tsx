import { test } from 'zora';
import { engineSource, muxSource, wistiaSource } from '../src/sources';

test('engineSource() - src only', (t) => {
  t.eq(engineSource('https://youtu.be/abc', undefined), {
    source: { src: 'https://youtu.be/abc', engine: {} },
  });
});

test('engineSource() - config becomes source.engine, without mux and wistia', (t) => {
  t.eq(
    engineSource('https://example.com/a.m3u8', {
      hlsJs: { debug: true },
      youtube: { color: 'white' },
      mux: { poster: { time: 5 } },
      wistia: { playerColor: 'ff0000' },
    }),
    {
      source: {
        src: 'https://example.com/a.m3u8',
        engine: { hlsJs: { debug: true }, youtube: { color: 'white' } },
      },
    }
  );
});

test('muxSource() - bare stream URL becomes a playback id', (t) => {
  t.eq(muxSource('https://stream.mux.com/abc123', undefined), {
    source: { playbackId: 'abc123', engine: {} },
  });
});

test('muxSource() - query params become playback params', (t) => {
  t.eq(muxSource('https://stream.mux.com/abc123?max_resolution=720p&token=jwt', undefined), {
    source: { playbackId: 'abc123', engine: {}, playback: { maxResolution: '720p', token: 'jwt' } },
  });
});

test('muxSource() - config.mux is layered on top, with the engine options', (t) => {
  t.eq(
    muxSource('https://stream.mux.com/abc123?max_resolution=720p', {
      hlsJs: { maxBufferLength: 60 },
      mux: { playback: { maxResolution: '1080p' }, poster: { time: 5 } },
    }),
    {
      source: {
        playbackId: 'abc123',
        engine: { hlsJs: { maxBufferLength: 60 } },
        playback: { maxResolution: '1080p' },
        poster: { time: 5 },
      },
    }
  );
});

test('muxSource() - non-Mux URL is passed through', (t) => {
  t.eq(muxSource('https://example.com/video.m3u8', { mux: { drm: { token: 'x' } } }), {
    source: { src: 'https://example.com/video.m3u8', engine: {}, drm: { token: 'x' } },
  });
});

test('wistiaSource()', (t) => {
  t.eq(
    wistiaSource('https://home.wistia.com/medias/e4a27b971d', {
      youtube: { color: 'white' },
      wistia: { playerColor: 'ff0000' },
    }),
    {
      src: 'https://home.wistia.com/medias/e4a27b971d',
      source: { playerColor: 'ff0000' },
    }
  );
});
