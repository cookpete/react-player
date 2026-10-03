import './helpers/server-safe-globals.js';
import React from 'react';
import { act } from 'react-test-renderer';
import { expect, test, vi } from 'vite-plus/test';

import HtmlPlayer from '../src/HtmlPlayer';
import Player from '../src/Player';
import { render } from './helpers/helpers';

test('video.load()', async () => {
  const videoRef: React.Ref<HTMLVideoElement> = React.createRef();
  render(<Player ref={videoRef} src="file.mp4" activePlayer={HtmlPlayer} />);

  const loadstart = vi.fn();
  videoRef.current?.addEventListener('loadstart', loadstart);

  await Promise.resolve();
  expect(loadstart).toHaveBeenCalledOnce();
});

test('video.play()', async () => {
  const videoRef: React.Ref<HTMLVideoElement> = React.createRef();
  const wrapper = render(<Player ref={videoRef} src="file.mp4" playing={false} activePlayer={HtmlPlayer} />);

  const play = vi.fn();
  videoRef.current?.addEventListener('play', play);

  act(() => {
    wrapper.update(<Player ref={videoRef} src="file.mp4" playing={true} activePlayer={HtmlPlayer} />);
  });
  await Promise.resolve();

  expect(play).toHaveBeenCalledOnce();
  expect(videoRef.current?.paused).toBe(false);
});

test('video.pause()', async () => {
  const videoRef: React.Ref<HTMLVideoElement> = React.createRef();
  const wrapper = render(<Player ref={videoRef} src="file.mp4" playing={true} activePlayer={HtmlPlayer} />);

  const pause = vi.fn();
  videoRef.current?.addEventListener('pause', pause);

  act(() => {
    wrapper.update(<Player ref={videoRef} src="file.mp4" playing={false} activePlayer={HtmlPlayer} />);
  });
  await Promise.resolve();

  expect(pause).toHaveBeenCalledOnce();
  expect(videoRef.current?.paused).toBe(true);
});

test('video.volume = 0.5', async () => {
  const videoRef: React.Ref<HTMLVideoElement> = React.createRef();
  const wrapper = render(<Player ref={videoRef} src="file.mp4" activePlayer={HtmlPlayer} />);

  act(() => {
    wrapper.update(<Player ref={videoRef} src="file.mp4" volume={0.5} activePlayer={HtmlPlayer} />);
  });
  await Promise.resolve();

  expect(videoRef.current?.volume).toBe(0.5);
});

test('video.muted = true', async () => {
  let videoRef: React.Ref<HTMLVideoElement> = React.createRef();
  const wrapper = render(<Player ref={videoRef} src="file.mp4" activePlayer={HtmlPlayer} />);
  expect(videoRef.current?.muted).toBe(false);

  act(() => {
    videoRef = React.createRef();
    wrapper.update(<Player ref={videoRef} src="file.mp4" muted activePlayer={HtmlPlayer} />);
  });
  await Promise.resolve();

  expect(videoRef.current?.muted).toBe(true);
});

test('video.muted = false', async () => {
  let videoRef: React.Ref<HTMLVideoElement> = React.createRef();
  const wrapper = render(<Player ref={videoRef} src="file.mp4" muted activePlayer={HtmlPlayer} />);
  expect(videoRef.current?.muted).toBe(true);

  act(() => {
    videoRef = React.createRef();
    wrapper.update(<Player ref={videoRef} src="file.mp4" activePlayer={HtmlPlayer} />);
  });
  await Promise.resolve();

  expect(videoRef.current?.muted).toBe(false);
});

test('video.playbackRate = 0.5', async () => {
  const videoRef: React.Ref<HTMLVideoElement> = React.createRef();
  const wrapper = render(<Player ref={videoRef} src="file.mp4" activePlayer={HtmlPlayer} />);

  act(() => {
    wrapper.update(<Player ref={videoRef} src="file.mp4" playbackRate={0.5} activePlayer={HtmlPlayer} />);
  });
  await Promise.resolve();

  expect(videoRef.current?.playbackRate).toBe(0.5);
});

test('video.duration', async () => {
  const videoRef: React.Ref<HTMLVideoElement> = React.createRef();
  render(
    <Player
      ref={videoRef}
      src="https://stream.mux.com/a4nOgmxGWg6gULfcBbAa00gXyfcwPnAFldF8RdsNyk8M/low.mp4"
      activePlayer={HtmlPlayer}
    />
  );

  await new Promise((resolve) => {
    videoRef.current?.addEventListener('durationchange', resolve);
  });

  expect(videoRef.current?.duration).toBe(10);
});
