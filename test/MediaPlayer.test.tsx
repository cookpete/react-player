import './helpers/server-safe-globals.js';
import { test } from 'zora';
import sinon from 'sinon';
import React from 'react';
import { act } from 'react-test-renderer';
import Player from '../src/Player';
import { createMediaPlayer } from '../src/MediaPlayer';
import { engineSource } from '../src/sources';
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
      {children}
    </video>
  );
});

const FakePlayer = createMediaPlayer(FakeMedia, engineSource('fake'));

test('src and config become the media source', (t) => {
  const wrapper = render(
    <Player src="file.mp4" config={{ color: 'white' } as never} activePlayer={FakePlayer} />
  );
  const video = wrapper.root.findByType('video');

  t.eq(JSON.parse(video.props['data-source']), {
    src: 'file.mp4',
    engine: { fake: { color: 'white' } },
  });
  t.equal(video.props.config, undefined, 'config is not passed to the media');
});

test('attributes, callbacks and children pass through unchanged', (t) => {
  const onPlay = sinon.fake();
  const wrapper = render(
    <Player
      src="file.mp4"
      autoPlay
      muted
      controls
      className="rp"
      onPlay={onPlay}
      activePlayer={FakePlayer}
    >
      <track kind="captions" />
    </Player>
  );
  const video = wrapper.root.findByType('video');

  t.equal(video.props.autoPlay, true);
  t.equal(video.props.muted, true);
  t.equal(video.props.controls, true);
  t.equal(video.props.className, 'rp');
  t.ok(wrapper.root.findByType('track'));
  t.equal(video.props.volume, undefined, 'volume is applied via the ref, not as a prop');
  t.equal(video.props.playbackRate, undefined, 'playbackRate is applied via the ref, not as a prop');

  act(() => {
    video.props.onPlay(new Event('play'));
  });
  t.ok(onPlay.calledOnce);
});

test('ref is the media and is driven by playing / volume / playbackRate', async (t) => {
  const ref: React.RefObject<HTMLVideoElement> = React.createRef();
  const wrapper = render(
    <Player ref={ref} src="file.mp4" playing volume={0.5} playbackRate={2} activePlayer={FakePlayer} />
  );
  await Promise.resolve();

  t.ok(ref.current);
  t.equal(ref.current?.paused, false);
  t.equal(ref.current?.volume, 0.5);
  t.equal(ref.current?.playbackRate, 2);

  act(() => {
    wrapper.update(
      <Player ref={ref} src="file.mp4" playing={false} volume={0.5} playbackRate={2} activePlayer={FakePlayer} />
    );
  });
  t.equal(ref.current?.paused, true);
});

test('ReactPlayer ref is passed as mediaRef, not as the element ref', (t) => {
  const ref: React.RefObject<HTMLVideoElement> = React.createRef();
  const wrapper = render(<Player ref={ref} src="file.mp4" activePlayer={FakePlayer} />);
  const media = wrapper.root.findByType(FakeMedia);

  t.ok(typeof media.props.mediaRef === 'function' || media.props.mediaRef === ref);
  t.ok(ref.current, 'ref receives the media');
});

test('source is stable across re-renders with the same src and config', (t) => {
  const config = { color: 'white' } as never;
  const wrapper = render(<Player src="file.mp4" config={config} activePlayer={FakePlayer} />);
  const before = wrapper.root.findByType(FakeMedia).props.source;

  act(() => {
    wrapper.update(<Player src="file.mp4" config={config} activePlayer={FakePlayer} />);
  });
  t.equal(wrapper.root.findByType(FakeMedia).props.source, before);
});
