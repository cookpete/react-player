#!/usr/bin/env node
import { parseArgs } from 'node:util'
import { build } from 'esbuild'

const { values: args, positionals } = parseArgs({
  options: {},
  strict: false,
  allowPositionals: true
})

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
    js: args['footer:js'] ?? ''
  }
}

if (!args.watch) {
  build(options)
}
