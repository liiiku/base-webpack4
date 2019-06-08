const path = require('path')
const CopyrightWebpackPlugin = require('./plugins/copyright-webapck-plugin')

module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  plugins: [
    new CopyrightWebpackPlugin({
      name: 'hello'
    })
  ]
}