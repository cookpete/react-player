import React from 'react';
import { create } from 'react-test-renderer';
import { expect, test } from 'vite-plus/test';

import '../helpers/server-safe-globals';
import ReactPlayer from '../../src/index';
import Player from '../../src/Player';

test('canPlay()', () => {
  expect(ReactPlayer.canPlay('https://www.youtube.com/watch?v=oUFJJNQGwhk')).toBeTruthy();
  expect(ReactPlayer.canPlay('https://youtube.com/shorts/370kwJ-x5TY?feature=share')).toBeTruthy();
  expect(ReactPlayer.canPlay('https://vimeo.com/90509568')).toBeTruthy();
  expect(ReactPlayer.canPlay('https://home.wistia.com/medias/e4a27b971d')).toBeTruthy();
  expect(ReactPlayer.canPlay('http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4')).toBeTruthy();
  expect(ReactPlayer.canPlay('http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4#t=1')).toBeTruthy();
  expect(ReactPlayer.canPlay('http://example.com/random/path')).toBeFalsy();
});

test('addCustomPlayer()', () => {
  const CustomPlayer = React.forwardRef(() => <video />);
  CustomPlayer.displayName = 'CustomPlayer';
  CustomPlayer.canPlay = (src) => /example\.com/.test(src);

  ReactPlayer.addCustomPlayer(CustomPlayer);
  const wrapper = create(<ReactPlayer src="http://example.com/random/path" />);
  expect(ReactPlayer.canPlay('http://example.com/random/path')).toBeTruthy();
  expect(wrapper.root.findByType(Player)).toBeTruthy();
  expect(wrapper.root.findByType(Player).props.activePlayer).toBe(CustomPlayer);
  ReactPlayer.removeCustomPlayers();
  expect(ReactPlayer.canPlay('http://example.com/random/path')).toBeFalsy();
});
