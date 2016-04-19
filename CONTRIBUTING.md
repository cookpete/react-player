# Contributing to ReactPlayer

Thanks for contributing to ReactPlayer!

## `dist` files

There is **no need** to build or commit files in `dist` after making changes. The `dist` files are only there for [bower](http://bower.io) support, and there is very little point in polluting every commit or pull request with the changes. The `dist` files will be automatically built and commmited when new versions are released, so your changes will be included then.

## Linting

This project uses [standard](https://github.com/feross/standard) code style. Be sure to lint the code after making changes and fix any issues that come up.

```bash
npm run lint
```

## Testing

This project uses [karma](https://karma-runner.github.io) with [mocha](https://github.com/mochajs/mocha) and [chai](https://github.com/chaijs/chai) for testing in the browser. Be sure to test `ReactPlayer` after making changes and, if you’re feeling generous, add some tests of your own.

```bash
npm test
```
