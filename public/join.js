const socket = io()
const body = document.querySelector('.js-body')
const form = document.querySelector('.js-join')
const joined = document.querySelector('.js-joined')
const buzzer = document.querySelector('.js-buzzer')
const joinedInfo = document.querySelector('.js-joined-info')
const editInfo = document.querySelector('.js-edit')
const buzzList = document.querySelector('.js-buzzes')

let user = {}

const getUserInfo = () => {
  user = JSON.parse(localStorage.getItem('user')) || {}

  if (user.name) {
    form.querySelector('[name=name]').value = user.name
    form.querySelector('[name=team][value=' + user.team + ']').checked = true
  }
}

const saveUserInfo = () => {
  localStorage.setItem('user', JSON.stringify(user))
}

form.addEventListener('submit', (e) => {
  e.preventDefault()

  user.name = form.querySelector('[name=name]').value
  user.team = form.querySelector('[name=team]:checked').value

  if (!user.id) {
    user.id = Math.floor(Math.random() * new Date())
  }

  socket.emit('join', user)
  saveUserInfo()
  joinedInfo.innerText = `${user.name} on Team ${user.team}`
  form.classList.add('hidden')
  joined.classList.remove('hidden')
  body.classList.add('buzzer-mode')
})

buzzer.addEventListener('click', (e) => {
  socket.emit('buzz', user)
})

editInfo.addEventListener('click', () => {
  joined.classList.add('hidden')
  form.classList.remove('hidden')
  body.classList.remove('buzzer-mode')
})

document.addEventListener('keydown', function(e) {
  if (e.which == 32 && user.name) {
    socket.emit('buzz', user)
  }
})

socket.on('buzzes', (buzzes) => {
  buzzList.innerHTML = buzzes
    .map(buzz => {
      const p = buzz.split('-')
      return { name: p[0], team: p[1] }
    })
    .map(user => `<li>${user.name} on Team ${user.team}</li>`)
    .join('')
})

getUserInfo()
