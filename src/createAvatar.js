import jpgPath from './test.jpg'
import style from './index.scss'

function createAvatar() {
  var img = new Image()
  img.src = jpgPath
  img.classList.add(style.jpg)

  var root = document.getElementById('root')
  root.append(img)
}

export default createAvatar