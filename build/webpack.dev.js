const webpack = require('webpack');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common');

const devConfig = {
  // entry: './src/index.js',
  mode: 'development', // 默认是production 不配置会有一个警告
  devtool: 'cheap-module-eval-source-map',
  output: { // 在开发环境，不用关心用户缓存的问题，HMR 或者 直接刷新浏览器都可以解决这个更新的问题
    filename: '[name].js', // 不写这个，打包默认生成的文件叫entry入口中配置的key的名字, 如果是多个文件打包，这里这么写死，就会报错，应该用占位符来写
    chunkFilename: '[name].chunk.js',
  },
  devServer: {
    contentBase: '../dist', // 这个服务器要启在哪一个文件夹下，因为都是打包到dist目录下，所以服务要起到dist目录下
    // open: true
    // publicPath: '/public/' // 所以这样访问的时候就要是localhost:8082/public/index.html 这个也就是起的这个服务器将资源打包到了哪里
    hot: true,
    // hotOnly: true // 即便hot-module-replacement 没有生效也不让浏览器自动刷新
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader', 
          'css-loader',
          'postcss-loader'
        ] // 因为需要用的loader不是一个了，所以这里就不能用一个对象了
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader', 
          // 'css-loader', // 要个css-loader 加一些配置项，这里就不要写字符串了，要写对象
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
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  // optimization: {
  //   usedExports: true // 看看哪些导出的模块被使用了再做打包
  // }
}

module.exports = merge(commonConfig, devConfig);