import './helpers/server-safe-globals.js';
import React from 'react';
import { act } from 'react-test-renderer';
import { expect, test, vi } from 'vite-plus/test';

import { createMediaPlayer } from '../src/MediaPlayer';
import Player from '../src/Player';
import { render } from './helpers/helpers';

/**
 * Stand-in for a `@videojs/react` media component: takes `<video>`-like props plus a structured
 * `source`, and hands the media to `mediaRef`.
 */
const FakeMedia = React.forwardRef<HTMLVideoElement, Record<string, unknown>>((props, ref) => {
  const { source, mediaRef, children, ...rest } = props;
  return (
    <video
      {...rest}
      data-source={JSON.stringify(source)}
      ref={(node) => {
        for (const r of [ref, mediaRef as React.Ref<HTMLVideoElement>]) {
          if (typeof r === 'function') r(node);
          else if (r) (r as React.MutableRefObject<HTMLVideoElement | null>).current = node;
        }
      }}
    >
      {children as React.ReactNode}
    </video>
  );
});

const FakePlayer = createMediaPlayer(FakeMedia);

test('src and config become the media source', () => {
  const wrapper = render(
    <Player
      src="file.m3u8"
      config={{ hlsJs: { debug: true }, youtube: { color: 'white' } }}
      activePlayer={FakePlayer}
    />
  );
  const video = wrapper.root.findByType('video');

  expect(JSON.parse(video.props['data-source'])).toEqual({
    src: 'file.m3u8',
    engine: { hlsJs: { debug: true }, youtube: { color: 'white' } },
  });
  expect(video.props.config, 'config is not passed to the media').toBeUndefined();
});

test('attributes, callbacks and children pass through unchanged', () => {
  const onPlay = vi.fn();
  const wrapper = render(
    <Player src="file.mp4" autoPlay muted controls className="rp" onPlay={onPlay} activePlayer={FakePlayer}>
      <track kind="captions" />
    </Player>
  );
  const video = wrapper.root.findByType('video');

  expect(video.props.autoPlay).toBe(true);
  expect(video.props.muted).toBe(true);
  expect(video.props.controls).toBe(true);
  expect(video.props.className).toBe('rp');
  expect(wrapper.root.findByType('track')).toBeTruthy();
  expect(video.props.volume, 'volume is applied via the ref, not as a prop').toBeUndefined();
  expect(video.props.playbackRate, 'playbackRate is applied via the ref, not as a prop').toBeUndefined();

  act(() => {
    video.props.onPlay(new Event('play'));
  });
  expect(onPlay).toHaveBeenCalledOnce();
});

test('ref is the media and is driven by playing / volume / playbackRate', async () => {
  const ref: React.RefObject<HTMLVideoElement> = React.createRef();
  const wrapper = render(
    <Player ref={ref} src="file.mp4" playing volume={0.5} playbackRate={2} activePlayer={FakePlayer} />
  );
  await Promise.resolve();

  expect(ref.current).toBeTruthy();
  expect(ref.current?.paused).toBe(false);
  expect(ref.current?.volume).toBe(0.5);
  expect(ref.current?.playbackRate).toBe(2);

  act(() => {
    wrapper.update(
      <Player ref={ref} src="file.mp4" playing={false} volume={0.5} playbackRate={2} activePlayer={FakePlayer} />
    );
  });
  expect(ref.current?.paused).toBe(true);
});

test('ReactPlayer ref is passed as mediaRef, not as the element ref', () => {
  const ref: React.RefObject<HTMLVideoElement> = React.createRef();
  const wrapper = render(<Player ref={ref} src="file.mp4" activePlayer={FakePlayer} />);
  const media = wrapper.root.findByType(FakeMedia);

  expect(typeof media.props.mediaRef === 'function' || media.props.mediaRef === ref).toBe(true);
  expect(ref.current, 'ref receives the media').toBeTruthy();
});
