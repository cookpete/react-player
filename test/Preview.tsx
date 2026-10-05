import './helpers/server-safe-globals.js';
import { test } from 'zora';
import React from 'react';
import { act, create } from 'react-test-renderer';
import Preview from '../src/Preview';

const preview = (src: string, light: boolean | string = true, onClickPreview?: () => void) => (
  <Preview src={src} light={light} oEmbedUrl="https://example.com/oembed?url={url}"
    onClickPreview={onClickPreview} />
);

test('failed and outdated thumbnail requests leave the preview usable', async (t) => {
  const originalFetch = globalThis.fetch;
  let clicks = 0;
  globalThis.fetch = async () => { throw new Error('network unavailable'); };

  try {
    let wrapper;
    act(() => {
      wrapper = create(preview('https://example.com/video-a', true, () => { clicks++; }));
    });
    await Promise.resolve();

    const element = wrapper.root.findByProps({ className: 'react-player__preview' });
    t.equal(element.props.style.backgroundImage, undefined);
    element.props.onClick({});
    t.equal(clicks, 1);
    act(() => { wrapper.unmount(); });

    let resolveFirst;
    globalThis.fetch = () => new Promise((resolve) => { resolveFirst = resolve; }) as Promise<Response>;
    act(() => {
      wrapper = create(preview('https://example.com/video-b'));
    });
    act(() => {
      wrapper.update(preview('https://example.com/video-c', 'https://example.com/new.jpg'));
    });
    resolveFirst({ ok: true, json: async () => ({ thumbnail_url: 'https://example.com/old.jpg' }) });
    await Promise.resolve();
    await Promise.resolve();

    const updated = wrapper.root.findByProps({ className: 'react-player__preview' });
    t.equal(updated.props.style.backgroundImage, 'url(https://example.com/new.jpg)');
    act(() => { wrapper.unmount(); });
  } finally {
    globalThis.fetch = originalFetch;
  }
});
