import '../helpers/server-safe-globals.js';
import { createPlayer } from '@videojs/react';
import React from 'react';
import { expect, test } from 'vite-plus/test';

import ReactPlayer from '../../src/index';
import { render } from '../helpers/helpers';

test('attaches its media to a surrounding Video.js player', () => {
  const { Player, useMedia } = createPlayer({ features: [] });
  let attached: unknown = null;

  const ReadMedia = () => {
    attached = useMedia();
    return null;
  };

  const mediaRef = React.createRef<HTMLVideoElement>();
  render(
    <Player>
      <ReactPlayer src="file.mp4" mediaRef={mediaRef} />
      <ReadMedia />
    </Player>
  );

  expect(mediaRef.current).toBeTruthy();
  expect(attached).toBe(mediaRef.current);
});
