// var jpg = require('./test.jpg')
import jpgPath from './test.jpg'
// import './index.css'
// import './index.scss' // 这样引入样式实际上是全局的，也就是也影响了createAvatar 这个函数中的样式
import style from './index.scss' // 会让这个模块里面的样式不会和其他的文件有什么的耦合和冲突
import createAvatar from './createAvatar'

createAvatar() // 这里面的样式不受下面的style.jpg的影响，如果想要这里面的图片也有下面的jpg的样式，所以需要在这里面也加上className

var img = new Image()
img.src = jpgPath
// img.classList.add('jpg')
img.classList.add(style.jpg)

var root = document.getElementById('root')
root.append(img)