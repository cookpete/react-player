import '../helpers/server-safe-globals.js';
import { test } from 'zora';
import React from 'react';
import { create } from 'react-test-renderer';
import ReactPlayer from '../../src/index';
import { render } from '../helpers/helpers';

test('className', async (t) => {
  const wrapper = render(<ReactPlayer src="file.mp4" className="react-player" />);
  t.equal(wrapper.root.findByType('video').props.className, 'react-player');
});

test('style', (t) => {
  const wrapper = render(<ReactPlayer src="file.mp4" style={{ marginTop: '1rem' }} />);
  t.equal(wrapper.root.findByType('video').props.style.marginTop, '1rem');
});

test('wrapper - string', (t) => {
  const wrapper = create(<ReactPlayer wrapper="span" />);
  t.equal(wrapper.toJSON().type, 'span');
});

test('wrapper - element', (t) => {
  const Element = () => null;
  const wrapper = create(<ReactPlayer wrapper={Element} />);
  t.ok(wrapper.root.findByType(Element));
});
