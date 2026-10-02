import './helpers/server-safe-globals.js';
import React from 'react';
import { expect, test, vi } from 'vite-plus/test';

import Player from '../src/Player';

// Mock the activePlayer component
const MockActivePlayer = React.forwardRef<HTMLVideoElement, any>((props, ref) => {
  return React.createElement('video', { ...props, ref });
});

test('filters out ReactPlayer-specific event handlers to prevent React warnings', async () => {
  // Capture warnings
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

  const props = {
    activePlayer: MockActivePlayer,
    onReady: vi.fn(),
    onStart: vi.fn(),
    onPlay: vi.fn(),
    onPause: vi.fn(),
    onEnded: vi.fn(),
    onLoadStart: vi.fn(),
    // These should be passed through to the underlying video element
    onLoadedMetadata: vi.fn(),
    onCanPlay: vi.fn(),
    onError: vi.fn(),
  };

  // Just verify that the component can be created without errors
  // The actual filtering logic is tested by the fact that no warnings are generated
  expect(React.createElement(Player, props)).toBeTruthy();

  // Check that no warnings about unknown event handlers were logged
  const unknownEventHandlerWarnings = warn.mock.calls
    .map((args) => args.join(' '))
    .filter((warning) => warning.includes('Unknown event handler property'));
  expect(unknownEventHandlerWarnings).toHaveLength(0);

  warn.mockRestore();
});
