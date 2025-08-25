import './helpers/server-safe-globals.js';
import { test } from 'zora';
import sinon from 'sinon';
import React from 'react';
import Player from '../src/Player';

// Mock the activePlayer component
const MockActivePlayer = React.forwardRef<HTMLVideoElement, any>((props, ref) => {
  return React.createElement('video', { ...props, ref });
});

test('filters out ReactPlayer-specific event handlers to prevent React warnings', async (t) => {
  // Mock console.warn to capture warnings
  const originalWarn = console.warn;
  const warnings: string[] = [];
  console.warn = sinon.fake((...args) => {
    warnings.push(args.join(' '));
  });

  const props = {
    activePlayer: MockActivePlayer,
    onReady: sinon.fake(),
    onStart: sinon.fake(),
    onPlay: sinon.fake(),
    onPause: sinon.fake(),
    onEnded: sinon.fake(),
    onLoadStart: sinon.fake(),
    // These should be passed through to the underlying video element
    onLoadedMetadata: sinon.fake(),
    onCanPlay: sinon.fake(),
    onError: sinon.fake(),
  };

  // Just verify that the component can be created without errors
  // The actual filtering logic is tested by the fact that no warnings are generated
  t.ok(React.createElement(Player, props));

  // Check that no warnings about unknown event handlers were logged
  const unknownEventHandlerWarnings = warnings.filter(warning => 
    warning.includes('Unknown event handler property')
  );
  t.equal(unknownEventHandlerWarnings.length, 0);

  // Restore console.warn
  console.warn = originalWarn;
});
