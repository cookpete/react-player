import { test } from 'zora';
import sinon from 'sinon';
import React from 'react';
import { act, create } from 'react-test-renderer';
import Preview from '../src/Preview';

await test('reports a failed thumbnail request and keeps the preview clickable', async (t) => {
  const originalFetch = globalThis.fetch;
  const error = new Error('network unavailable');
  const onPreviewError = sinon.fake();
  const onClickPreview = sinon.fake();
  globalThis.fetch = sinon.fake.rejects(error) as typeof fetch;

  try {
    let wrapper: ReturnType<typeof create>;
    await act(async () => {
      wrapper = create(
        <Preview
          src="https://example.com/failed-video"
          light
          oEmbedUrl="https://noembed.com/embed?url={url}"
          onPreviewError={onPreviewError}
          onClickPreview={onClickPreview}
        />
      );
    });

    t.ok(onPreviewError.calledOnceWithExactly(error));
    const preview = wrapper!.root.findByProps({ className: 'react-player__preview' });
    t.equal(preview.props.style.backgroundImage, undefined);
    act(() => preview.props.onClick({}));
    t.ok(onClickPreview.calledOnce);
    act(() => wrapper!.unmount());
  } finally {
    globalThis.fetch = originalFetch;
  }
});

await test('reports unsuccessful responses without trying to parse them', async (t) => {
  const originalFetch = globalThis.fetch;
  const onPreviewError = sinon.fake();
  const json = sinon.fake();
  globalThis.fetch = sinon.fake.resolves({ ok: false, status: 503, json }) as typeof fetch;

  try {
    let wrapper: ReturnType<typeof create>;
    await act(async () => {
      wrapper = create(
        <Preview
          src="https://example.com/unavailable-video"
          light
          oEmbedUrl="https://noembed.com/embed?url={url}"
          onPreviewError={onPreviewError}
        />
      );
    });

    t.ok(onPreviewError.calledOnce);
    t.ok(onPreviewError.firstCall.args[0] instanceof Error);
    t.ok(onPreviewError.firstCall.args[0].message.includes('503'));
    t.ok(json.notCalled);
    act(() => wrapper!.unmount());
  } finally {
    globalThis.fetch = originalFetch;
  }
});

await test('ignores a thumbnail request after the source changes', async (t) => {
  const originalFetch = globalThis.fetch;
  const onPreviewError = sinon.fake();
  let rejectRequest: (error: Error) => void = () => {};
  globalThis.fetch = sinon.fake.returns(new Promise((_resolve, reject) => {
    rejectRequest = reject;
  })) as typeof fetch;

  try {
    let wrapper: ReturnType<typeof create>;
    await act(async () => {
      wrapper = create(
        <Preview
          src="https://example.com/old-video"
          light
          oEmbedUrl="https://noembed.com/embed?url={url}"
          onPreviewError={onPreviewError}
        />
      );
    });

    act(() => {
      wrapper!.update(
        <Preview
          src="https://example.com/new-video"
          light="https://example.com/new-image.jpg"
          oEmbedUrl="https://noembed.com/embed?url={url}"
          onPreviewError={onPreviewError}
        />
      );
    });
    await act(async () => rejectRequest(new Error('old request failed')));

    const preview = wrapper!.root.findByProps({ className: 'react-player__preview' });
    t.equal(preview.props.style.backgroundImage, 'url(https://example.com/new-image.jpg)');
    t.ok(onPreviewError.notCalled);
    act(() => wrapper!.unmount());
  } finally {
    globalThis.fetch = originalFetch;
  }
});

await test('uses a fetched thumbnail when the request succeeds', async (t) => {
  const originalFetch = globalThis.fetch;
  const onPreviewError = sinon.fake();
  globalThis.fetch = sinon.fake.resolves({
    ok: true,
    json: async () => ({ thumbnail_url: 'https://example.com/image?height=100' }),
  }) as typeof fetch;

  try {
    let wrapper: ReturnType<typeof create>;
    await act(async () => {
      wrapper = create(
        <Preview
          src="https://example.com/successful-video"
          light
          oEmbedUrl="https://noembed.com/embed?url={url}"
          onPreviewError={onPreviewError}
        />
      );
    });

    const preview = wrapper!.root.findByProps({ className: 'react-player__preview' });
    t.equal(preview.props.style.backgroundImage, 'url(https://example.com/image?height=480)');
    t.ok(onPreviewError.notCalled);
    act(() => wrapper!.unmount());
  } finally {
    globalThis.fetch = originalFetch;
  }
});
