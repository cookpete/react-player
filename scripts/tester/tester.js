#!/usr/bin/env node
import { parseArgs, promisify } from 'node:util'
import process from 'node:process'
import { realpath } from 'node:fs/promises'
import { exec } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { build } from 'builder'

const asyncExec = promisify(exec)
const nodePath = await realpath(process.argv[1])
const modulePath = await realpath(fileURLToPath(import.meta.url))
const isCLI = nodePath === modulePath

if (isCLI) cliTest()

export async function cliTest () {
  console.time('\n⚡ Tested in')

  const { values: args, positionals } = parseArgs({
    options: {},
    strict: false,
    allowPositionals: true
  })

  await test(positionals, args)

  console.timeEnd('\n⚡ Tested in')
}

export async function test (positionals, args) {
  // Favor React production builds for testing.
  args['define:process.env.NODE_ENV'] = '"production"'

  // Set flag for adding stubs used in tests.
  args['define:globalThis.__TEST__'] = 'true'

  await build(positionals, args)

  await cmd(`echo '{"type": "module"}' > ${args.outdir}/package.json`)

  // Ignore test/helpers/ folder for running tests.
  positionals = positionals.filter(p => !p.startsWith('test/helpers/'))

  await Promise.all(positionals.map(async file => {
    console.log(await cmd(`node --enable-source-maps dist${file}`))
  }))
}

async function cmd (command, opts = {}) {
  command = command.trim().replace(/\s+/g, ' ')

  if (opts.verbose) console.log(`${command}`)

  const { stdout, stderr } = await asyncExec(command)

  if (stderr) {
    console.error(`\n${stderr}`)
  }

  return stdout.trim()
}
