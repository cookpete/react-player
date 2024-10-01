import { test } from 'zora';
import sinon from 'sinon';
import React from 'react';
import { create } from 'react-test-renderer';
import ReactPlayer from '../../src/index';

const COMMON_METHODS = ['getDuration', 'getCurrentTime', 'getSecondsLoaded', 'getInternalPlayer'];

// for (const method of COMMON_METHODS) {
//   test(`${method}()`, t => {
//     const instance = create(<ReactPlayer />).getInstance()
//     instance.references.player({ [method]: () => 123 })
//     t.ok(instance[method]() === 123)
//   })

//   test(`${method}() - null`, t => {
//     const instance = create(<ReactPlayer />).getInstance()
//     t.ok(instance[method]() === null)
//   })
// }

// test('getInternalPlayer() - default', t => {
//   const instance = create(<ReactPlayer />).getInstance()
//   const getInternalPlayer = sinon.fake.returns('abc')
//   instance.references.player({ getInternalPlayer })
//   t.ok(instance.getInternalPlayer() === 'abc')
//   t.ok(getInternalPlayer.calledOnceWith('player'))
// })

// test('seekTo()', t => {
//   const instance = create(<ReactPlayer />).getInstance()
//   instance.references.player({ seekTo: sinon.fake() })
//   instance.seekTo(5)
//   t.ok(instance.player.seekTo.calledOnce)
//   t.ok(instance.player.seekTo.calledWith(5))
// })

// test('seekTo() - null', t => {
//   const instance = create(<ReactPlayer />).getInstance()
//   t.ok(instance.seekTo() === null)
// })

// test('onReady()', t => {
//   const onReady = sinon.fake()
//   const instance = create(<ReactPlayer onReady={onReady} />).getInstance()
//   instance.handleReady()
//   t.ok(onReady.calledWith(instance))
// })

// test('refs', t => {
//   const instance = create(<ReactPlayer />).getInstance()
//   instance.references.player('abc')
//   instance.references.wrapper('def')
//   t.ok(instance.player === 'abc')
//   t.ok(instance.wrapper === 'def')
// })
