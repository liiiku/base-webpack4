const webpack = require('webpack');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common');

const devConfig = {
  // entry: './src/index.js',
  mode: 'development', // 默认是production 不配置会有一个警告
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: '../dist', // 这个服务器要启在哪一个文件夹下，因为都是打包到dist目录下，所以服务要起到dist目录下
    // open: true
    // publicPath: '/public/' // 所以这样访问的时候就要是localhost:8082/public/index.html 这个也就是起的这个服务器将资源打包到了哪里
    hot: true,
    // hotOnly: true // 即便hot-module-replacement 没有生效也不让浏览器自动刷新
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  optimization: {
    usedExports: true // 看看哪些导出的模块被使用了再做打包
  }
}

module.exports = merge(commonConfig, devConfig);