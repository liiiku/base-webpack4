/**
 * source: 引入文件的内容（源代码）
 */
const loaderUtils = require('loader-utils')

module.exports = function(source) {
  // console.log(6, this)
  // console.log(this.query)
  const options = loaderUtils.getOptions(this)
  const callback = this.async()

  setTimeout(() => {
    const result = source.replace('world', options.name)
    // return result
    callback(null, result) // 相当于调用了this.callback
  }, 1000)

  // const result = source.replace('world', options.name)
  // return source.replace('world', options.name)
  // this.callback(null, result)
  // return result
}