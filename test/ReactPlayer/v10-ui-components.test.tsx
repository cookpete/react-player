import '../helpers/server-safe-globals.js';
import { PlayButton } from '@videojs/react';
import { VideoPlayer } from '@videojs/react/video';
import React from 'react';
import { act } from 'react-test-renderer';
import { expect, test } from 'vite-plus/test';

import ReactPlayer from '../../src/index';
import { render } from '../helpers/helpers';

test('Video.js UI components control the media ReactPlayer renders', async () => {
  const mediaRef = React.createRef<HTMLVideoElement>();
  const wrapper = render(
    <VideoPlayer>
      <ReactPlayer src="file.mp4" mediaRef={mediaRef} />
      <PlayButton />
    </VideoPlayer>
  );
  expect(mediaRef.current?.paused).toBe(true);

  await act(async () => {
    wrapper.root.findByType('button').props.onClick({ preventDefault() {}, currentTarget: {} });
  });

  expect(mediaRef.current?.paused).toBe(false);
});
