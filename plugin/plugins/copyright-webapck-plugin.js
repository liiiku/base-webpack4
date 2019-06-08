class CopyrightWebpackPlugin {
  constructor(options) {
    console.log(options)
    console.log('插件被使用了')
  }
  /**
   * compiler 存放了配置的相关内容（webpack.config.js中的所有配置）
   * compilation 存放的只是和这次打包相关的内容，存放了这次打包的所有内容
   */
  apply(compiler) {
    // 同步
    compiler.hooks.compile.tap('CopyrightWebpackPlugin', (compilation) => {
      console.log('compile')
    })

    // 异步
    compiler.hooks.emit.tapAsync('CopyrightWebpackPlugin', (compilation, cb) => {
      console.log(compilation.assets)
      compilation.assets['copyright.txt'] = {
        source: function() {
          return 'copyright by lrn'
        },
        size: function() {
          return 16
        }
      }
      cb()
    })
  }
}

module.exports = CopyrightWebpackPlugin