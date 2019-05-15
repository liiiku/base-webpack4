const merge = require('webpack-merge');
const commonConfig = require('./webpack.common');

const prodConfig = {
  mode: 'production', // 默认是production 不配置会有一个警告
  devtool: 'cheap-module-source-map'
}

module.exports = merge(commonConfig, prodConfig);