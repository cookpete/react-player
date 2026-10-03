import { test } from 'zora';
import { canPlay } from '../src/patterns';

test('manifest URLs remain HLS or DASH sources when they contain media fragments', (t) => {
  t.ok(canPlay.hls('https://example.com/live.m3u8#t=10.5'));
  t.ok(canPlay.dash('https://example.com/movie.mpd#t=258'));
  t.notOk(canPlay.html('https://example.com/live.m3u8#t=10.5'));
  t.notOk(canPlay.html('https://example.com/movie.mpd#t=258'));
});

test('audio and video extensions accept fragments and query strings', (t) => {
  t.ok(canPlay.html('https://example.com/audio.mp3#t=5'));
  t.ok(canPlay.html('https://example.com/movie.mp4#t=10.5'));
  t.ok(canPlay.html('https://example.com/movie.mp4#chapter=1'));
  t.ok(canPlay.html('https://example.com/movie.mp4?token=abc#t=10.5'));
  t.ok(canPlay.hls('https://example.com/live.m3u8?token=abc#t=10'));
  t.notOk(canPlay.html('https://example.com/movie.mp4x#t=10'));
  t.notOk(canPlay.dash('https://example.com/movie.mpdx#t=10'));
});
