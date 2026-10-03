import '../helpers/server-safe-globals.js';
import React from 'react';
import { create } from 'react-test-renderer';
import { expect, test } from 'vite-plus/test';

import ReactPlayer from '../../src/index';
import { render } from '../helpers/helpers';

test('className', async () => {
  const wrapper = render(<ReactPlayer className="react-player" />);
  expect(wrapper.root.findByType('video').props.className).toBe('react-player');
});

test('style', () => {
  const wrapper = render(<ReactPlayer style={{ marginTop: '1rem' }} />);
  expect(wrapper.root.findByType('video').props.style.marginTop).toBe('1rem');
});

test('config is not passed to a native video', () => {
  const wrapper = render(<ReactPlayer src="file.mp4" config={{ youtube: { color: 'white' } }} />);
  expect(wrapper.root.findByType('video').props.config).toBeUndefined();
});

test('ref and mediaRef are both the native video element', () => {
  const ref = React.createRef<HTMLElement>();
  const mediaRef = React.createRef<HTMLVideoElement>();
  render(<ReactPlayer src="file.mp4" ref={ref} mediaRef={mediaRef} />);
  expect(ref.current).toBeTruthy();
  expect(mediaRef.current).toBe(ref.current);
});

test('wrapper - string', () => {
  const wrapper = create(<ReactPlayer wrapper="span" />);
  expect(wrapper.toJSON().type).toBe('span');
});

test('wrapper - element', () => {
  const Element = () => null;
  const wrapper = create(<ReactPlayer wrapper={Element} />);
  expect(wrapper.root.findByType(Element)).toBeTruthy();
});
