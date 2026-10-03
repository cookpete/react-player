import '../helpers/server-safe-globals.js';
import { createPlayer } from '@videojs/react';
import React from 'react';
import { act } from 'react-test-renderer';
import { expect, test } from 'vite-plus/test';

import ReactPlayer from '../../src/index';
import { render } from '../helpers/helpers';

test('mediaRef and useMedia() are the hls.js adapter, with its engine, behind a stream', async () => {
  const { Player, useMedia } = createPlayer({ features: [] });
  let media: unknown = null;

  const ReadMedia = () => {
    media = useMedia();
    return null;
  };

  const ref = React.createRef<HTMLElement>();
  const mediaRef = React.createRef<HTMLVideoElement>();
  await act(async () => {
    render(
      <Player>
        <ReactPlayer src="https://example.com/stream.m3u8" ref={ref} mediaRef={mediaRef} />
        <ReadMedia />
      </Player>
    );
    // Let the lazily loaded HlsJsVideo resolve.
    await import('@videojs/react/media/hlsjs-video');
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  expect(mediaRef.current).toBeTruthy();
  expect(media, 'mediaRef is the adapter the player uses').toBe(mediaRef.current);
  expect('engine' in (mediaRef.current as object)).toBe(true);
  expect(ref.current, 'ref is the rendered element, not the adapter').not.toBe(mediaRef.current);
});
