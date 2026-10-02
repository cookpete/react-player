import '../helpers/server-safe-globals.js';
import { createPlayer } from '@videojs/react';
import React from 'react';
import { act } from 'react-test-renderer';
import { expect, test } from 'vite-plus/test';

import ReactPlayer from '../../src/index';
import { render } from '../helpers/helpers';

test('useMedia() reaches the hls.js adapter, and its engine, behind a stream', async () => {
  const { Player, useMedia } = createPlayer({ features: [] });
  let media: unknown = null;

  const ReadMedia = () => {
    media = useMedia();
    return null;
  };

  const mediaRef = React.createRef<HTMLVideoElement>();
  await act(async () => {
    render(
      <Player>
        <ReactPlayer src="https://example.com/stream.m3u8" mediaRef={mediaRef} />
        <ReadMedia />
      </Player>
    );
    // Let the lazily loaded HlsJsVideo resolve.
    await import('@videojs/react/media/hlsjs-video');
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  expect(mediaRef.current).toBeTruthy();
  expect(media).toBeTruthy();
  expect(media, 'the player media is the adapter, not the element').not.toBe(mediaRef.current);
  expect(media && 'engine' in (media as object)).toBe(true);
  expect('engine' in (mediaRef.current as object)).toBe(false);
});
