/**
 * 这是一个同步的执行顺序，webpack，借助webpack.common.js中的optimization中的配置就可以实现code splitting
 */
import _ from 'lodash';

console.log(_.join(['a', 'b', 'cd'], '***'));

/**
 * 异步模块的引入 无需做任何配置，会自动进行code splitting 只需要解决动态import不支持的问题，引入babel-plugin-dynamic-import-plugin
 */
// function getComponent() {
//   return import(/* webpackChunkName: "lodash" */ 'lodash').then(({ default: _ }) => {
//     var element = document.createElement('div');
//     element.innerHTML = _.join(['abc', '123'], '-');
//     return element;
//   })
// }

// getComponent().then(element => {
//   document.body.appendChild(element);
// })
