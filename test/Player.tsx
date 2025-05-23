import './helpers/server-safe-globals.js';
import { test } from 'zora';
import sinon from 'sinon';
import { act } from 'react-test-renderer';
import React from 'react';
import Player from '../src/Player';
import HtmlPlayer from '../src/HtmlPlayer';
import { render } from './helpers/helpers';

test('video.load()', async (t) => {
  const videoRef: React.Ref<HTMLVideoElement> = React.createRef();
  render(<Player ref={videoRef} src="file.mp4" activePlayer={HtmlPlayer} />);

  const loadstart = sinon.fake();
  videoRef.current?.addEventListener('loadstart', loadstart);

  await Promise.resolve();
  t.ok(loadstart.calledOnce);
});

test('video.play()', async (t) => {
  const videoRef: React.Ref<HTMLVideoElement> = React.createRef();
  const wrapper = render(<Player ref={videoRef} src="file.mp4" playing={false} activePlayer={HtmlPlayer} />);

  const play = sinon.fake();
  videoRef.current?.addEventListener('play', play);

  act(() => {
    wrapper.update(<Player ref={videoRef} src="file.mp4" playing={true} activePlayer={HtmlPlayer} />);
  });
  await Promise.resolve();

  t.ok(play.calledOnce);
  t.equal(videoRef.current?.paused, false);
});

test('video.pause()', async (t) => {
  const videoRef: React.Ref<HTMLVideoElement> = React.createRef();
  const wrapper = render(<Player ref={videoRef} src="file.mp4" playing={true} activePlayer={HtmlPlayer} />);

  const pause = sinon.fake();
  videoRef.current?.addEventListener('pause', pause);

  act(() => {
    wrapper.update(<Player ref={videoRef} src="file.mp4" playing={false} activePlayer={HtmlPlayer} />);
  });
  await Promise.resolve();

  t.ok(pause.calledOnce);
  t.equal(videoRef.current?.paused, true);
});

test('video.volume = 0.5', async (t) => {
  const videoRef: React.Ref<HTMLVideoElement> = React.createRef();
  const wrapper = render(<Player ref={videoRef} src="file.mp4" activePlayer={HtmlPlayer} />);

  act(() => {
    wrapper.update(<Player ref={videoRef} src="file.mp4" volume={0.5} activePlayer={HtmlPlayer} />);
  });
  await Promise.resolve();

  t.equal(videoRef.current?.volume, 0.5);
});

test('video.muted = true', async (t) => {
  let videoRef: React.Ref<HTMLVideoElement> = React.createRef();
  const wrapper = render(<Player ref={videoRef} src="file.mp4" activePlayer={HtmlPlayer} />);
  t.equal(videoRef.current?.muted, false);

  act(() => {
    videoRef = React.createRef();
    wrapper.update(<Player ref={videoRef} src="file.mp4" muted activePlayer={HtmlPlayer} />);
  });
  await Promise.resolve();

  t.equal(videoRef.current?.muted, true);
});

test('video.muted = false', async (t) => {
  let videoRef: React.Ref<HTMLVideoElement> = React.createRef();
  const wrapper = render(<Player ref={videoRef} src="file.mp4" muted activePlayer={HtmlPlayer} />);
  t.equal(videoRef.current?.muted, true);

  act(() => {
    videoRef = React.createRef();
    wrapper.update(<Player ref={videoRef} src="file.mp4" activePlayer={HtmlPlayer} />);
  });
  await Promise.resolve();

  t.equal(videoRef.current?.muted, false);
});

test('video.playbackRate = 0.5', async (t) => {
  const videoRef: React.Ref<HTMLVideoElement> = React.createRef();
  const wrapper = render(<Player ref={videoRef} src="file.mp4" activePlayer={HtmlPlayer} />);

  act(() => {
    wrapper.update(<Player ref={videoRef} src="file.mp4" playbackRate={0.5} activePlayer={HtmlPlayer} />);
  });
  await Promise.resolve();

  t.equal(videoRef.current?.playbackRate, 0.5);
});

await test('video.duration', async (t) => {
  const videoRef: React.Ref<HTMLVideoElement> = React.createRef();
  render(<Player ref={videoRef} src="https://stream.mux.com/a4nOgmxGWg6gULfcBbAa00gXyfcwPnAFldF8RdsNyk8M/low.mp4" activePlayer={HtmlPlayer} />);

  await new Promise((resolve) => {
    videoRef.current?.addEventListener('durationchange', resolve);
  });

  t.equal(videoRef.current?.duration, 10);
});
