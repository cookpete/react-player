// const COMMON_METHODS = ['getDuration', 'getCurrentTime', 'getSecondsLoaded']

// for (const method of COMMON_METHODS) {
//   test(`${method}()`, t => {
//     const instance = create(<Player />).getInstance()
//     instance.player = { [method]: () => 123 }
//     instance.isReady = true
//     t.ok(instance[method]() === 123)
//   })

//   test(`${method}() - null`, t => {
//     const instance = create(<Player />).getInstance()
//     t.ok(instance[method]() === null)
//   })
// }

// test('progress()', t => {
//   const load = sinon.fake()
//   const onProgress = sinon.fake()
//   const instance = create(<Player url='file.mp4' onProgress={onProgress} />).getInstance()
//   instance.handlePlayerMount({
//     load,
//     getCurrentTime: sinon.fake.returns(10),
//     getSecondsLoaded: sinon.fake.returns(20),
//     getDuration: sinon.fake.returns(40)
//   })
//   instance.isReady = true
//   instance.progress()
//   instance.progress() // Call twice to ensure onProgress is not called again
//   t.ok(onProgress.calledOnceWith({
//     loaded: 0.5,
//     loadedSeconds: 20,
//     played: 0.25,
//     playedSeconds: 10
//   }))
// })

// test('progress() handlePlayerMount', t => {
//   const load = sinon.fake()
//   const onProgress = sinon.fake()
//   const instance = create(<Player url='file.mp4' onProgress={onProgress} />).getInstance()
//   instance.isReady = true
//   instance.handlePlayerMount({
//     load,
//     getCurrentTime: sinon.fake.returns(10),
//     getSecondsLoaded: sinon.fake.returns(20),
//     getDuration: sinon.fake.returns(40)
//   })
//   t.ok(onProgress.calledWith({
//     loaded: 0.5,
//     loadedSeconds: 20,
//     played: 0.25,
//     playedSeconds: 10
//   }))
// })

// test('seekTo() - seconds', t => {
//   const load = sinon.fake()
//   const seekTo = sinon.fake()
//   const instance = create(<Player />).getInstance()
//   instance.handlePlayerMount({ load, seekTo })
//   instance.isReady = true
//   instance.seekTo(10)
//   t.ok(seekTo.calledOnceWith(10))
// })

// test('seekTo() - fraction', t => {
//   const load = sinon.fake()
//   const seekTo = sinon.fake()
//   const instance = create(<Player />).getInstance()
//   instance.handlePlayerMount({
//     load,
//     seekTo,
//     getDuration: sinon.fake.returns(10)
//   })
//   instance.isReady = true
//   instance.seekTo(0.5)
//   t.ok(seekTo.calledOnceWith(5))
// })

// test('seekTo() - warning', t => {
//   const stub = sinon.stub(console, 'warn')
//   const load = sinon.fake()
//   const seekTo = sinon.fake()
//   const instance = create(<Player />).getInstance()
//   instance.handlePlayerMount({
//     load,
//     seekTo,
//     getDuration: sinon.fake.returns(null)
//   })
//   instance.isReady = true
//   instance.seekTo(0.5)
//   t.ok(seekTo.notCalled)
//   t.ok(stub.calledOnce)
//   stub.restore()
// })

// test('seekTo() - set seekOnPlay', t => {
//   const load = sinon.fake()
//   const seekTo = sinon.fake()
//   const instance = create(<Player />).getInstance()
//   instance.handlePlayerMount({ load, seekTo })
//   instance.isReady = false
//   instance.seekTo(10)
//   t.ok(seekTo.notCalled)
//   t.ok(instance.seekOnPlay === 10)
// })

// test('onReady()', t => {
//   const onReady = sinon.fake()
//   const load = sinon.fake()
//   const setVolume = sinon.fake()
//   const play = sinon.fake()
//   const instance = create(<Player onReady={onReady} playing volume={1} />).getInstance()
//   instance.handlePlayerMount({ load, setVolume, play })
//   instance.handleDurationCheck = sinon.fake()
//   instance.isReady = true
//   instance.handleReady()
//   t.ok(setVolume.calledOnceWith(1))
//   t.ok(play.calledOnce)
// })

// test('loadOnReady', t => {
//   const load = sinon.fake()
//   const play = sinon.fake()
//   const instance = create(<Player />).getInstance()
//   instance.handlePlayerMount({ load, play })
//   instance.handleDurationCheck = sinon.fake()
//   instance.loadOnReady = 'file.mp4'
//   instance.handleReady()
//   t.ok(load.calledWith('file.mp4'))
//   t.ok(play.notCalled)
// })

// test('onPlay()', t => {
//   const onPlay = sinon.fake()
//   const instance = create(<Player onPlay={onPlay} />).getInstance()
//   instance.handlePlayerMount({ load: () => {} })
//   instance.handleDurationCheck = sinon.fake()
//   instance.handlePlay()
//   t.ok(onPlay.calledOnce)
//   t.ok(instance.isPlaying)
//   t.notOk(instance.isLoading)
// })

// test('onStart()', t => {
//   const onStart = sinon.fake()
//   const instance = create(<Player onStart={onStart} />).getInstance()
//   instance.handlePlayerMount({ load: () => {} })
//   instance.handleDurationCheck = sinon.fake()
//   instance.startOnPlay = true
//   instance.handlePlay()
//   t.ok(onStart.calledOnce)
//   t.notOk(instance.startOnPlay)
// })

// test('seekOnPlay', t => {
//   const seekTo = sinon.stub(Player.prototype, 'seekTo')
//   const instance = create(<Player />).getInstance()
//   instance.handlePlayerMount({ load: () => {} })
//   instance.handleDurationCheck = sinon.fake()
//   instance.seekOnPlay = 10
//   instance.handlePlay()
//   t.ok(seekTo.calledOnceWith(10))
//   t.ok(instance.seekOnPlay === null)
//   seekTo.restore()
// })

// test('onPause()', t => {
//   const onPause = sinon.fake()
//   const instance = create(<Player onPause={onPause} />).getInstance()
//   instance.isLoading = false
//   instance.handlePause()
//   t.ok(onPause.calledOnce)
//   t.notOk(instance.isPlaying)
// })

// test('onPause() - isLoading', t => {
//   const onPause = sinon.fake()
//   const instance = create(<Player onPause={onPause} />).getInstance()
//   instance.isLoading = true
//   instance.handlePause()
//   t.ok(onPause.notCalled)
// })

// test('onEnded()', t => {
//   const activePlayer = () => null
//   const onEnded = sinon.fake()
//   const instance = create(<Player activePlayer={activePlayer} onEnded={onEnded} />).getInstance()
//   instance.isPlaying = true
//   instance.handleEnded()
//   t.ok(onEnded.calledOnce)
//   t.notOk(instance.isPlaying)
// })

// test('loopOnEnded', t => {
//   const activePlayer = () => null
//   activePlayer.loopOnEnded = true
//   const seekTo = sinon.stub(Player.prototype, 'seekTo')
//   const instance = create(<Player loop activePlayer={activePlayer} />).getInstance()
//   instance.handlePlayerMount({ load: () => {} })
//   instance.isPlaying = true
//   instance.handleEnded()
//   t.ok(seekTo.calledOnceWith(0))
//   t.ok(instance.isPlaying)
//   seekTo.restore()
// })

// test('handleDurationCheck', t => {
//   const onDuration = sinon.fake()
//   const instance = create(<Player onDuration={onDuration} />).getInstance()
//   instance.getDuration = sinon.fake.returns(10)
//   instance.handleDurationCheck()
//   instance.handleDurationCheck() // Call twice to ensure onDuration is not called again
//   t.ok(onDuration.calledOnceWith(10))
//   t.ok(instance.onDurationCalled)
// })

// test('durationCheckTimeout', t => {
//   const onDuration = sinon.fake()
//   const instance = create(<Player onDuration={onDuration} />).getInstance()
//   instance.getDuration = sinon.fake.returns(null)
//   instance.durationCheckTimeout = null
//   instance.handleDurationCheck()
//   t.ok(onDuration.notCalled)
//   t.truthy(instance.durationCheckTimeout)
// })
