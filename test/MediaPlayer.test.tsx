import './helpers/server-safe-globals.js';
import React from 'react';
import { act } from 'react-test-renderer';
import { expect, test, vi } from 'vite-plus/test';

import { createMediaPlayer } from '../src/MediaPlayer';
import Player from '../src/Player';
import { render } from './helpers/helpers';

/** Stand-in for the playback adapter an embed hands to `mediaRef`. */
class FakeAdapter {
  paused = true;
  volume = 1;
  playbackRate = 1;
  constructor(public target: HTMLElement) {}
  play() {
    this.paused = false;
  }
  pause() {
    this.paused = true;
  }
}

const assignRef = <T,>(ref: unknown, value: T | null) => {
  if (typeof ref === 'function') ref(value);
  else if (ref) (ref as React.MutableRefObject<T | null>).current = value;
};

/**
 * Stand-in for a `@videojs/react` embed media component: takes `<video>`-like props plus a
 * structured `source`, hands the rendered element to `ref` and its adapter to `mediaRef`.
 */
const FakeMedia = React.forwardRef<HTMLElement, Record<string, unknown>>((props, ref) => {
  const { source, mediaRef, children, ...rest } = props;
  const adapter = React.useRef<FakeAdapter | null>(null);
  return (
    <video
      {...rest}
      data-source={JSON.stringify(source)}
      ref={(node) => {
        if (node) adapter.current ??= new FakeAdapter(node);
        assignRef(ref, node);
        assignRef(mediaRef, node && adapter.current);
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
  expect(video.props.volume, 'volume is applied via the media, not as a prop').toBeUndefined();
  expect(video.props.playbackRate, 'playbackRate is applied via the media, not as a prop').toBeUndefined();

  act(() => {
    video.props.onPlay(new Event('play'));
  });
  expect(onPlay).toHaveBeenCalledOnce();
});

test('ref is the rendered element and mediaRef the media', () => {
  const ref = React.createRef<HTMLElement>();
  const mediaRef = React.createRef<HTMLVideoElement>();
  render(<Player ref={ref} mediaRef={mediaRef} src="file.mp4" activePlayer={FakePlayer} />);

  expect(ref.current, 'ref receives the element').toBeTruthy();
  expect(mediaRef.current, 'mediaRef receives the adapter').toBeInstanceOf(FakeAdapter);
  expect((mediaRef.current as unknown as FakeAdapter).target).toBe(ref.current);
});

test('the media is driven by playing / volume / playbackRate', async () => {
  const mediaRef = React.createRef<HTMLVideoElement>();
  const wrapper = render(
    <Player mediaRef={mediaRef} src="file.mp4" playing volume={0.5} playbackRate={2} activePlayer={FakePlayer} />
  );
  await Promise.resolve();

  expect(mediaRef.current?.paused).toBe(false);
  expect(mediaRef.current?.volume).toBe(0.5);
  expect(mediaRef.current?.playbackRate).toBe(2);

  act(() => {
    wrapper.update(
      <Player
        mediaRef={mediaRef}
        src="file.mp4"
        playing={false}
        volume={0.5}
        playbackRate={2}
        activePlayer={FakePlayer}
      />
    );
  });
  expect(mediaRef.current?.paused).toBe(true);
});

test('the media, not the element, is driven without a mediaRef', async () => {
  const ref = React.createRef<HTMLElement>();
  render(<Player ref={ref} src="file.mp4" playing activePlayer={FakePlayer} />);
  await Promise.resolve();

  expect((ref.current as HTMLVideoElement).paused, 'the element is not played').toBe(true);
});
