const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');
const webpack = require('webpack');

const plugins = [
  new HtmlWebpackPlugin({
    template: 'src/index.html'
  }),
  new CleanWebpackPlugin({
    root: path.resolve(__dirname, '../') // 根路径不再是当前文件坐在的目录了，而是当前文件夹向上一层的路径
  }),
  new webpack.ProvidePlugin({
    $: 'jquery', // 如果一个文件中引用了$，就会在模块中自动帮忙引入jquery
    // _: 'lodash'
    _join: ['lodash', 'join']
  })
];

// 通过node分析dll目录下，有多少个*.dll.js文件，有多少*.manifest.json文件，动态的往plugins中添加
const files = fs.readdirSync(path.resolve(__dirname, '../dll'));
console.log(files);
files.forEach(file => {
  if (/.*\.dll.js/.test(file)) {
    plugins.push(
      new AddAssetHtmlWebpackPlugin({
        filepath: path.resolve(__dirname, '../dll', file)
      })
    )
  }
  if (/.*\.manifest.json/.test(file)) {
    plugins.push(
      new webpack.DllReferencePlugin({
        manifest: path.resolve(__dirname, '../dll', file)
      })
    )
  }
});


module.exports = {
  performance: false, // 打包的时候不提示警告信息
  entry: {
    main: path.resolve(__dirname, '../src/index.js')
  },
  output: {
    path: path.resolve(__dirname, '../dist')
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    mainFiles: ['index', 'child'], // import Child from './child/'  如果只写了目录，没有写具体文件的时候，会默认先找index.js(x) 然后找child.js(x)
    alias: {
      '@': path.resolve(__dirname, '../src') // 起别名有一个好处就是，如果使用相对路径，如果文件移动了，就会直接报错，使用@这样的绝对路径，可以避免这样的问题
    }
  },
  module: { // 也就是打包模块的时候，不知道怎么办的时候，就到这里面来找了
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
        // use: [
        //   {
        //     loader: 'babel-loader'
        //   },
        //   {
        //     loader: 'imports-loader?this=>window'
        //   }
        // ]
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
    runtimeChunk: {
      name: 'runtime'
    },
    usedExports: true,
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
          name: 'vendors',
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
  plugins
}