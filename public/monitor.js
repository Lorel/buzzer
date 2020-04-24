const urlParams = new URLSearchParams(window.location.search);
const team = urlParams.get('team');
let score = urlParams.get('score');

const ready = (e) => {
  const svgClasslList = document.querySelector('svg').classList
  const classname = () => `${team}-${score}`

  svgClasslList.add(classname())

  window.parent.socket.on('scores', (scores) => {
    svgClasslList.remove(classname())
    score = scores[team]
    svgClasslList.add(classname())
  })
}

document.addEventListener('DOMContentLoaded', ready)
