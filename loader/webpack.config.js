const path = require('path')

module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  resolveLoader: {
    modules: ['node_modules', './loaders']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        // use: [path.resolve(__dirname, './loaders/replaceLoader.js')]
        use: [
          {
            // loader: path.resolve(__dirname, './loaders/replaceLoader.js'),
            loader: 'replaceLoader'
            // options: {
            //   name: 'haha'
            // }
          },
          {
            // loader: path.resolve(__dirname, './loaders/replaceLoaderAsync.js'),
            loader: 'replaceLoaderAsync',
            options: {
              name: 'haha'
            }
          },
        ]
      }
    ]
  }
}