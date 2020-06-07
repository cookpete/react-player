const getExcludes = lazy => {
  if (lazy) {
    // Disable transforming `import()` statements to enable lazy players
    return ['@babel/plugin-proposal-dynamic-import']
  }
  return []
}

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      { exclude: getExcludes(process.env.LAZY) }
    ],
    '@babel/preset-react'
  ],
  plugins: [
    'react-hot-loader/babel',
    '@babel/plugin-proposal-class-properties'
  ],
  env: {
    test: {
      plugins: [
        'istanbul'
      ]
    }
  }
}
