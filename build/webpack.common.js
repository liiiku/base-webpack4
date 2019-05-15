const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: {
    main: path.resolve(__dirname, '../src/index.js')
  },
  output: {
    filename: '[name].js', // 不写这个，打包默认生成的文件叫entry入口中配置的key的名字, 如果是多个文件打包，这里这么写死，就会报错，应该用占位符来写
    path: path.resolve(__dirname, '../dist')
  },
  module: { // 也就是打包模块的时候，不知道怎么办的时候，就到这里面来找了
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
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
  optimization: {
    splitChunks: {
      chunks: 'all', // async 做代码分割的时候只对异步代码生效 initial 只对同步代码进行分割，并且要对cacheGroups做相关的配置才可以，如果只是这里设置all也是不会对同步代码进行代码分割的 all 是对异步和同步代码都做代码分割
      minSize: 30000, // 引入的模块大于这个值之后才会去做代码分割
      maxSize: 0, // 如果这里设置了50000 假设打包了一个lodash 1mb，webpack会尝试对lodash做二次拆分，看能不能拆分成20个50kb的文件 一般用默认值
      minChunks: 1, // 当一个模块至少被用了多少次之后才被代码分割
      maxAsyncRequests: 5, // 同时加载的模块数最多是5个 假如说引入了10个模块，就分割了10js文件，一打开网页要加载10个js文件，但是设置了这个，webpack在遇到前5个库的时候会做代码分割，超过了5个就不会做了
      maxInitialRequests: 3, // 整个网页首页，入口文件如果做代码分割最多是3个 这个两个配置一般用默认配置
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: { // 打包同步代码的时候，会走到这个配置项 如果引入了一个lodash 一个jquery，两个都符合代码分割的要求，并不是lodash直接都分割到一个js文件了，而是等所有符合要求的库，这样才能做到下面说的把所有第三方库都打包一个文件中的功能
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10, // 这里就是优先级，谁大谁优先级高   就是说到底打包到哪里的问题，是打包到vendors.js还是common.js中
          // filename: 'vendors.js' // 把所有的第三方库都打包到vendors.js中 也就是打包到一个文件中
        },
        default: { // 如果是同步打包没有走上面的vendors的话，就走这个默认的配置项
          priority: -20,
          reuseExistingChunk: true, // 如果一个模块已经被打包了，再打包的时候就会忽略掉这个模块 index.js中引入了a.js/b.js a.js中又引入了b.js，在第一次打包的时候，就已经打包了b.js，所以后面到a.js中再引入，就不会忽略b.js
          // filename: 'common.js'
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new CleanWebpackPlugin({
      root: path.resolve(__dirname, '../') // 根路径不再是当前文件坐在的目录了，而是当前文件夹向上一层的路径
    })
  ]
}