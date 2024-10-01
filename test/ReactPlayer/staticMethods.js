import { test } from 'zora';
import React from 'react';
import { create } from 'react-test-renderer';
import '../helpers/server-safe-globals';
import ReactPlayer from '../../src/index';
import Player from '../../src/Player';

test('canPlay()', (t) => {
  t.ok(ReactPlayer.canPlay('https://www.youtube.com/watch?v=oUFJJNQGwhk'));
  t.ok(ReactPlayer.canPlay('https://youtube.com/shorts/370kwJ-x5TY?feature=share'));
  t.ok(ReactPlayer.canPlay('https://vimeo.com/90509568'));
  t.ok(ReactPlayer.canPlay('https://home.wistia.com/medias/e4a27b971d'));
  t.ok(ReactPlayer.canPlay('http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4'));
  t.ok(ReactPlayer.canPlay('http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4#t=1'));
  t.notOk(ReactPlayer.canPlay('http://example.com/random/path'));
});

test('addCustomPlayer()', (t) => {
  const CustomPlayer = React.forwardRef(() => <video />);
  CustomPlayer.displayName = 'CustomPlayer';
  CustomPlayer.canPlay = (url) => /example\.com/.test(url);

  ReactPlayer.addCustomPlayer(CustomPlayer);
  const wrapper = create(<ReactPlayer src="http://example.com/random/path" />);
  t.ok(ReactPlayer.canPlay('http://example.com/random/path'));
  t.ok(wrapper.root.findByType(Player));
  t.equal(wrapper.root.findByType(Player).props.activePlayer, CustomPlayer);
  ReactPlayer.removeCustomPlayers();
  t.notOk(ReactPlayer.canPlay('http://example.com/random/path'));
});
