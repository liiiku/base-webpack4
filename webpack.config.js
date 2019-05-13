const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = {
  // entry: './src/index.js',
  mode: 'development', // 默认是production 不配置会有一个警告
  entry: {
    main: './src/index.js',
    sub: './src/index.js'
  },
  output: {
    publicPath: './', // js引用路径或cdn地址
    filename: '[name].js', // 不写这个，打包默认生成的文件叫entry入口中配置的key的名字, 如果是多个文件打包，这里这么写死，就会报错，应该用占位符来写
    path: path.resolve(__dirname, 'dist')
  },
  module: { // 也就是打包模块的时候，不知道怎么办的时候，就到这里面来找了
    rules: [
      {
        test: /\.(jpg|png|gif)$/,
        use: {
          loader: 'url-loader', // 和file-loader不同，会转成base64的字符串直接打包到bundle.js中
          options: {
            name: '[name].[hash:5].[ext]',
            outputPath: 'images/',  // 打包到dist目录下的images目录中
            limit: 2048 // 这里就是到底是用file-loader还是url-loader来打包，也就是说如果超过了2048个字节的话，就会想file-loader一样打包到一个文件夹中，如果没有，就url，打包到js中
          }
        }
      },
      // {
      //   test: /\.css$/,
      //   use: ['style-loader', 'css-loader'] // 因为需要用的loader不是一个了，所以这里就不能用一个对象了
      // }
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
      },
      {
        test: /\.(eot|ttf|svg|woff)$/,
        use: {
          loader: 'file-loader', // 打包字体文件，只需要借助file-loader 把这些文件从src目录移动到dist目录下就可以了
          options: {
            name: '[name].[hash:5].[ext]',
            outputPath: 'font/'
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new CleanWebpackPlugin(),
  ],
}