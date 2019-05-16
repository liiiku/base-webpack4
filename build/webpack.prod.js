const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const commonConfig = require('./webpack.common');

const prodConfig = {
  mode: 'production', // 默认是production 不配置会有一个警告
  // devtool: 'cheap-module-source-map',
  output: { // 线上环境打包，就需要加上contenthash：代码没有改变，打包生成的contenthash永远不会变，只要代码一遍，就会发生变化
    filename: '[name].[contenthash].js', // 不写这个，打包默认生成的文件叫entry入口中配置的key的名字, 如果是多个文件打包，这里这么写死，就会报错，应该用占位符来写
    chunkFilename: '[name].[contenthash].chunk.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ] // 因为需要用的loader不是一个了，所以这里就不能用一个对象了
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2, // 在scss中通过import引入的scss文件，如果没有这个的话，就直接走css-loader style-loader 了，就不走postcss-loader 和 scss-loader，也就是不管是从里引入的，都是走所有的loader
              // modules: true // 开启css的模块化打包 这就是css-module的概念
            }
          },
          'sass-loader',
          'postcss-loader' // 默认加上厂商前缀 -webkit- -moz- postcss-loader 处理的时候，会找到postcss.config.js处理
        ] // 因为需要用的loader不是一个了，所以这里就不能用一个对象了 先经过sass-loader 处理，再css-loader 再style-loader处理
      }
    ]
  },
  optimization: {
    minimizer: [new OptimizeCSSAssetsPlugin({})]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].chunk.css'
    })
  ]
}

module.exports = merge(commonConfig, prodConfig);