import { join } from 'path'
import webpack from 'webpack'
import { extract } from 'extract-text-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const PORT = 3000
const PRODUCTION = process.env.NODE_ENV === 'production'
const PUBLIC_PATH = PRODUCTION ? '' : `http://localhost:${PORT}/`

const PATH_DEMO = join(__dirname, 'demo')
const PATH_SRC = join(__dirname, 'src')
const PATH_INDEX = join(__dirname, 'index.html')
const PATH_TESTS = join(__dirname, 'test', 'specs')

export const plugins = [
  new HtmlWebpackPlugin({
    template: PATH_INDEX,
    minify: {
      collapseWhitespace: true,
      quoteCharacter: '\''
    }
  })
]

export default {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'react-hot-loader/patch',
    `webpack-dev-server/client?http://localhost:${PORT}`,
    'webpack/hot/only-dev-server',
    './src/demo/index'
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [ PATH_SRC, PATH_TESTS ]
      },
      {
        test: /\.scss$/,
        use: styleLoader([
          'style-loader',
          'css-loader?sourceMap',
          'sass-loader?sourceMap'
        ]),
        include: PATH_SRC
      }
    ]
  },
  output: {
    path: PATH_DEMO,
    filename: 'app.js',
    publicPath: PUBLIC_PATH
  },
  plugins: [
    ...plugins,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin()
  ],
  devServer: {
    port: PORT,
    publicPath: PUBLIC_PATH,
    hot: true,
    historyApiFallback: true,
    stats: {
      colors: true
    }
  }
}

function styleLoader (loaders) {
  if (process.env.NODE_ENV === 'production') {
    const [ fallback, ...use ] = loaders
    return extract({ fallback, use })
  }
  return loaders
}
