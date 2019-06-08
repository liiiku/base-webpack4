/**
 * source: 引入文件的内容（源代码）
 */
const loaderUtils = require('loader-utils')

module.exports = function(source) {
  return source.replace('haha', 'world!!!!!')
}