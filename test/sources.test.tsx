import { test } from 'zora';
import { engineSource, muxSource, wistiaSource } from '../src/sources';

test('engineSource() - src only', (t) => {
  t.eq(engineSource('youtube')('https://youtu.be/abc', undefined), {
    source: { src: 'https://youtu.be/abc' },
  });
});

test('engineSource() - src with config', (t) => {
  t.eq(engineSource('hlsJs')('https://example.com/a.m3u8', { debug: true }), {
    source: { src: 'https://example.com/a.m3u8', engine: { hlsJs: { debug: true } } },
  });
});

test('muxSource() - bare stream URL becomes a playback id', (t) => {
  t.eq(muxSource('https://stream.mux.com/abc123', undefined), {
    source: { playbackId: 'abc123' },
  });
});

test('muxSource() - query params become playback params', (t) => {
  t.eq(muxSource('https://stream.mux.com/abc123?max_resolution=720p&token=jwt', undefined), {
    source: { playbackId: 'abc123', playback: { maxResolution: '720p', token: 'jwt' } },
  });
});

test('muxSource() - config is layered on top', (t) => {
  t.eq(
    muxSource('https://stream.mux.com/abc123?max_resolution=720p', {
      playback: { maxResolution: '1080p' },
      poster: { time: 5 },
    }),
    {
      source: {
        playbackId: 'abc123',
        playback: { maxResolution: '1080p' },
        poster: { time: 5 },
      },
    }
  );
});

test('muxSource() - non-Mux URL is passed through', (t) => {
  t.eq(muxSource('https://example.com/video.m3u8', { drm: { token: 'x' } }), {
    source: { src: 'https://example.com/video.m3u8', drm: { token: 'x' } },
  });
});

test('wistiaSource()', (t) => {
  t.eq(wistiaSource('https://home.wistia.com/medias/e4a27b971d', { playerColor: 'ff0000' }), {
    src: 'https://home.wistia.com/medias/e4a27b971d',
    source: { playerColor: 'ff0000' },
  });
});
