// 简单实现webpack-dev-server的功能也就是 src/index.js 改变之后，webpack实时编译，浏览器自动刷新
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const config = require('./build/webpack.dev.js/index.js.js');
const complier = webpack(config); // webpack 结合 配置文件随时可以进行代码的编译 返回一个编译器，让其执行一次，就会打包一次代码

const app = express();
// 只要文件发生改变了，complier就会重新运行进行打包，打包生成的文件的输出路径就是publicPath
app.use(webpackDevMiddleware(complier, {
  publicPath: config.output.publicPath
}))

app.listen(3000, () => {
  console.log('server is running on port 3000!');
})