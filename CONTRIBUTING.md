# Contributing to ReactPlayer

Thanks for contributing to ReactPlayer!

This project uses [pnpm](https://pnpm.io) and [Vite+](https://viteplus.dev) (`vp`) for building, testing, linting and formatting. The Node version is pinned in `.node-version`.

Running the demo locally is relatively easy:

```bash
git clone https://github.com/CookPete/react-player.git
cd react-player
pnpm install
pnpm start
```

## `dist` files

There is **no need** to build or commit files in `dist` after making changes. The `dist` files will be automatically built when new versions are released, so your changes will be included then.

## Linting and formatting

Code is linted with Oxlint and formatted with Oxfmt via Vite+. A pre-commit hook runs `vp staged` to fix staged files automatically.

```bash
pnpm lint      # check formatting and lint
pnpm lint:fix  # fix formatting and lint issues
pnpm typecheck
```

## Testing

This project uses [Vitest](https://vitest.dev) via `vp test`. Be sure to test `ReactPlayer` after making changes and, if you’re feeling generous, add some tests of your own.

```bash
pnpm test
```
