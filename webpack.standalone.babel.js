import path from 'path'
import config, { minifyPlugins } from './webpack.demo.babel'

export default {
  ...config,
  entry: './src/standalone.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'ReactPlayer.standalone.js',
    library: 'renderReactPlayer',
    libraryExport: 'default'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: minifyPlugins
}
