// import "@babel/polyfill"; // 这样是把所有的es6方法都打包了，很大，我现在只想用promise map这两个方法

const arr = [
  new Promise(() => {}),
  new Promise(() => {})
];

arr.map(item => {
  console.log(item);
})
