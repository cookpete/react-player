import { defineConfig } from 'vite-plus';

const ignoredPaths = ['**/coverage/**', '**/demo/**', '**/dist/**', '**/*.md', '**/*.sublime-*', '**/*.code-workspace'];

export default defineConfig({
  pack: {
    entry: ['src/**/*.{ts,tsx}'],
    unbundle: true,
    format: 'es',
    platform: 'browser',
    target: 'es2019',
    hash: false,
    sourcemap: false,
    dts: { generator: 'tsgo' },
    inputOptions: {
      // Unbundled output maps each source file to one output file, so `'use client'` stays at the top of it.
      onLog(level, log, defaultHandler) {
        if (log.code === 'MODULE_LEVEL_DIRECTIVE') return;
        defaultHandler(level, log);
      },
    },
  },
  test: {
    include: ['test/**/*.test.{js,jsx,ts,tsx}'],
    coverage: {
      include: ['src/**'],
      reporter: ['text', 'json'],
    },
  },
  fmt: {
    arrowParens: 'always',
    bracketSpacing: true,
    ignorePatterns: ignoredPaths,
    printWidth: 120,
    semi: true,
    singleQuote: true,
    sortImports: true,
    sortPackageJson: true,
    tabWidth: 2,
    trailingComma: 'es5',
    useTabs: false,
    overrides: [
      {
        files: ['**/*.css'],
        options: {
          singleQuote: false,
        },
      },
    ],
  },
  lint: {
    ignorePatterns: ignoredPaths,
    plugins: ['typescript', 'react'],
    options: {
      typeAware: false,
      typeCheck: false,
    },
  },
  staged: {
    '*': 'vp check --fix --no-error-on-unmatched-pattern',
  },
});
