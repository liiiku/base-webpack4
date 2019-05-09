const path = require('path')

module.exports = {
  // entry: './src/index.js',
  mode: 'development', // 默认是production 不配置会有一个警告
  entry: {
    app: './src/index.js'
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
}