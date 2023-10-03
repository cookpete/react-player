#!/usr/bin/env node
import { parseArgs } from 'node:util'
import { build, context } from 'esbuild'

const { values: args, positionals } = parseArgs({
  options: {},
  strict: false,
  allowPositionals: true
})

// https://esbuild.github.io/api/#live-reload
const livereloadJs = 'new EventSource(\'/esbuild\').addEventListener(\'change\', () => location.reload());'

const options = {
  target: 'es2019',
  logLevel: 'info',
  entryPoints: positionals,
  outfile: args.outfile,
  outdir: args.outfile ? undefined : args.outdir ?? 'dist',
  bundle: args.bundle,
  minify: args.minify,
  format: args.format,
  sourcemap: args.sourcemap,
  globalName: args['global-name'],
  outExtension: args['out-extension'],
  plugins: [],
  define: {},
  loader: {
    '.js': 'jsx',
    '.html': 'text',
    '.css': 'text',
    '.svg': 'text'
  },
  footer: {
    js: (args['footer:js'] ?? '') +
        (args.livereload ? `\n${livereloadJs}` : '')
  }
}

if (args.watch) {
  context(options).then(ctx => {
    ctx.watch().then(() => {
      if (args.servedir) {
        ctx.serve({
          servedir: args.servedir
        })
      }
    })
  })
}

if (!args.watch) {
  build(options)
}
