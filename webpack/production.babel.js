import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import TerserPlugin from 'terser-webpack-plugin'
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
    minimize: true,
    minimizer: [
      new TerserPlugin({ sourceMap: true }),
      new OptimizeCSSAssetsPlugin({})
    ]
  }
}
