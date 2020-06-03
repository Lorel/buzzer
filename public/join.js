const body = document.querySelector('.js-body')
const form = document.querySelector('.js-join')
const joined = document.querySelector('.js-joined')
const buzzer = document.querySelector('.js-buzzer')
const joinedInfo = document.querySelector('.js-joined-info')
const editInfo = document.querySelector('.js-edit')
const buzzList = document.querySelector('.js-buzzes')
const scoresContainer = document.querySelector('.scores')

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
  const team = `${user.name.toUpperCase()} on Team ${user.team.toUpperCase()}`
  const bgLink = `<a href="/${user.team}-bg.jpg" target="_blank">get your BG</a>`
  joinedInfo.innerHTML = `<span class="${user.team}">${team} (${bgLink})</span>`
  form.classList.add('hidden')
  joined.classList.remove('hidden')
  body.classList.add('buzzer-mode')

  return false
})

buzzer.addEventListener('click', (e) => {
  buzzer.focus()
  socket.emit('buzz', user)
  setTimeout(() => buzzer.blur(), 400)
})

editInfo.addEventListener('click', () => {
  joined.classList.add('hidden')
  form.classList.remove('hidden')
  body.classList.remove('buzzer-mode')
})

document.addEventListener('keydown', function(e) {
  if (e.which == 32 && user.name) {
    buzzer.click()
    buzzer.focus()
  }
})

socket.on('buzzes', (buzzes) => {
  buzzList.innerHTML = buzzes
    .map(buzz => {
      const p = buzz.split('-')
      return { name: p[0], team: p[1] }
    })
    .map(user => `<li class="buzz ${user.team}">${user.name.toUpperCase()}</li>`)
    .join('')

  if (buzzes.length == 1) {
    // play sound only for first buzz
    play(buzzes[0].split('-')[1])
  }
})

getUserInfo()
