/**
 * 这是一个同步的执行顺序，webpack，借助webpack.common.js中的optimization中的配置就可以实现code splitting
 */
// import _ from 'lodash';

// var element = document.createElement('div');
// element.innerHTML = _.join(['abc', '123'], '-');
// document.body.appendChild(element);

// 现在就有一个疑问：上面的同步代码这么简洁，为啥要有下面这样的代码呢？因为下面这样的代码可以实现懒加载

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

// document.addEventListener('click', () => {
//   getComponent().then(element => {
//     document.body.appendChild(element);
//   })
// })

// async function getComponent() {
//   const { default: _  } = await import(/* webpackChunkName: "lodash" */ 'lodash')
//   const element = document.createElement('div');
//   element.innerHTML = _.join(['abc', '123'], '-');
//   return element;
// }

// document.addEventListener('click', () => {
//   getComponent().then(element => {
//     document.body.appendChild(element);
//   })
// })

document.addEventListener('click', () => {
  import('./click').then(({ default: func }) => { // _ 这的就是click 导出的handleClick方法
    func();
  })
})
