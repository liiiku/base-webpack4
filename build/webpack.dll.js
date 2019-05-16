const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: {
    vendors: ['react', 'react-dom', 'lodash']
  },
  output: {
    path: path.resolve(__dirname, '../dll'),
    filename: '[name].dll.js',
    library: '[name]' // 把打包生成的vendors.dll.js 通过一个全局变量暴露出来，全局变量也就是叫 vendors ||  library 就是打包生成一个库，这个库在页面中应该如何的暴露出去，这里通过一个变量暴露出去，变量的名字叫vendors
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]', // 表示要对这个生成的库进行分析，也就是vendors.dll.js 因为是通过 library 的 变量暴露出去的，所以和上面保持一致
      path: path.resolve(__dirname,  '../dll/[name].manifest.json')  // 分析的结果放到这里
    })
  ]
}