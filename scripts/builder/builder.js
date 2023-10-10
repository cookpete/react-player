#!/usr/bin/env node
import { parseArgs } from 'node:util'
import esbuild from 'esbuild'
import process from 'node:process'
import { realpath } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const nodePath = await realpath(process.argv[1])
const modulePath = await realpath(fileURLToPath(import.meta.url))
const isCLI = nodePath === modulePath

if (isCLI) cliBuild()

export async function cliBuild () {
  const { values: args, positionals } = parseArgs({
    options: {},
    strict: false,
    allowPositionals: true
  })

  await build(positionals, args)
}

export async function build (positionals, args) {
  // https://esbuild.github.io/api/#live-reload
  const livereloadJs = 'new EventSource(\'/esbuild\').addEventListener(\'change\', () => location.reload());'

  // Assigns external modules to global variables.
  // https://github.com/evanw/esbuild/issues/337
  const plugins = {
    'global-externals': (arg) => {
      const options = JSON.parse(arg)
      const filter = new RegExp(`^${Object.keys(options)}$`)

      return {
        name: 'global-externals-plugin',
        setup (build) {
          build.onResolve({ filter }, (args) => ({
            path: args.path,
            namespace: 'global-externals-plugin'
          }))
          build.onLoad({ filter: /.*/, namespace: 'global-externals-plugin' }, (args) => {
            const contents = `module.exports = ${options[args.path]}`
            return { contents }
          })
        }
      }
    }
  }

  const options = {
    logLevel: 'info',
    entryPoints: positionals,
    outfile: args.outfile,
    outdir: args.outfile ? undefined : args.outdir ?? 'dist',
    target: args.target ?? 'es2019',
    bundle: args.bundle,
    minify: args.minify,
    format: args.format,
    platform: args.platform,
    sourcemap: args.sourcemap,
    globalName: args['global-name'],
    external: argsArray(args, 'external'),
    outExtension: argsObject(args, 'out-extension'),
    banner: argsObject(args, 'banner'),
    plugins: Object.entries(argsObject(args, 'plugin'))
      .map(([name, options]) => plugins[name](options)),
    define: {
      'globalThis.__TEST__': 'false',
      ...argsObject(args, 'define')
    },
    loader: {
      '.js': 'jsx',
      ...argsObject(args, 'loader')
    },
    footer: {
      ...argsObject(args, 'footer'),
      js: (args['footer:js'] ?? '') +
          (args.livereload ? `\n${livereloadJs}` : '')
    }
  }

  if (process.env.NODE_ENV) {
    options.define['process.env.NODE_ENV'] ||= `"${process.env.NODE_ENV}"`
  }

  // console.log(options)

  if (args.watch) {
    const ctx = await esbuild.context(options)

    await ctx.watch()

    if (args.servedir) {
      await ctx.serve({
        servedir: args.servedir
      })
    }

    return
  }

  await esbuild.build(options)
}

function argsArray (args, name) {
  return Object.keys(args)
    .filter(k => k.startsWith(`${name}:`))
    .map(k => k.slice(`${name}:`.length))
}

function argsObject (args, name) {
  return Object.keys(args)
    .filter(k => k.startsWith(`${name}:`))
    .reduce((acc, k) => {
      const key = k.slice(`${name}:`.length)
      acc[key] = args[k]
      return acc
    }, {})
}
