import path from 'path'
import config, { minifyPlugins } from './webpack.demo.babel'

export default {
  ...config,
  entry: './src/ReactPlayer',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'ReactPlayer.js',
    library: 'ReactPlayer',
    libraryExport: 'default'
  },
  externals: {
    'react': 'React'
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
