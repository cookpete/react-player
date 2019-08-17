import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import UglifyJsPlugin from 'uglifyjs-webpack-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import config, { plugins } from './config.babel'

export default {
  ...config,
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    ...plugins,
    new MiniCssExtractPlugin({
      filename: 'app.css',
      chunkFilename: '[name].css'
    })
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: true,
        uglifyOptions: {
          output: {
            comments: false
          }
        }
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  }
}
