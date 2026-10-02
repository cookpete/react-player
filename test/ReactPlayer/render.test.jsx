import React from 'react';
import { create } from 'react-test-renderer';
import { expect, test } from 'vite-plus/test';

import HtmlPlayer from '../../src/HtmlPlayer';
import ReactPlayer from '../../src/index';
import Player from '../../src/Player';

globalThis.window = { MediaStream: Object };

test.skip('render', () => {
  const wrapper = create(<ReactPlayer />);
  expect(wrapper.equals(<div style={{ width: '640px', height: '360px' }}>{null}</div>)).toBeTruthy();
});

test.skip('fallback player', () => {
  const wrapper = create(<ReactPlayer src="http://example.com/random/path" />);
  expect(
    wrapper.childAt(0).matchesElement(<Player activePlayer={HtmlPlayer} onReady={wrapper.instance().handleReady} />)
  ).toBeTruthy();
});
