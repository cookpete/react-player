import { test } from 'zora';
import React from 'react';
import { create } from 'react-test-renderer';
import ReactPlayer from '../../src/index';

test('className', (t) => {
  const wrapper = create(<ReactPlayer className="react-player" />);
  t.equal(wrapper.root.findByType('div').props.className, 'react-player');
});

test('style', (t) => {
  const wrapper = create(<ReactPlayer style={{ marginTop: '1rem' }} />);
  t.equal(wrapper.root.findByType('div').props.style.marginTop, '1rem');
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
