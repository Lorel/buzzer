const socket = io()
const active = document.querySelector('.js-active')
const buzzList = document.querySelector('.js-buzzes')
const clear = document.querySelector('.js-clear')

socket.on('active', (numberActive) => {
  active.innerText = `${numberActive} joined`
})

socket.on('buzzes', (buzzes) => {
  buzzList.innerHTML = buzzes
    .map(buzz => {
      const p = buzz.split('-')
      return { name: p[0], team: p[1] }
    })
    .map(user => `<li>${user.name.toUpperCase()} on Team ${user.team.toUpperCase()}</li>`)
    .join('')
})

clear.addEventListener('click', () => {
  socket.emit('clear')
})

document.addEventListener('keydown', function(e) {
  if (e.which == 32) {
    socket.emit('clear')
  }
})
