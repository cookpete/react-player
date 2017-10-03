import path from 'path'
import config, { minifyPlugins } from './webpack.demo.babel'

export default {
  ...config,
  entry: './src/ReactPlayer',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'ReactPlayer.js',
    library: 'ReactPlayer'
  },
  externals: {
    'react': 'React'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          plugins: ['add-module-exports']
        }
      }
    ]
  },
  plugins: minifyPlugins
}
