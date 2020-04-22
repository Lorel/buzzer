class Sound {
  constructor(src) {
    this.sound = document.createElement('audio');
    this.sound.src = src;
    this.sound.setAttribute('preload', 'auto');
    this.sound.setAttribute('controls', 'none');
    this.sound.style.display = 'none';
    document.body.appendChild(this.sound);
  }

  play() {
    this.sound.play()
  }
}

const mayoBuzz = new Sound('mayo.ogg')
const ketchupBuzz = new Sound('ketchup.ogg')
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
  joinedInfo.innerText = `${user.name.toUpperCase()} on Team ${user.team.toUpperCase()}`
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
  const noBuzz = buzzList.innerHTML.length == 0

  buzzList.innerHTML = buzzes
    .map(buzz => {
      const p = buzz.split('-')
      return { name: p[0], team: p[1] }
    })
    .map(user => `<li>${user.name.toUpperCase()} on Team ${user.team.toUpperCase()}</li>`)
    .join('')

  if (noBuzz && buzzes.length == 1) {
    switch (buzzes[0].split('-')[1]) {
      case 'mayo':
        mayoBuzz.play()
        break
      case 'ketchup':
        ketchupBuzz.play()
        break
    }
  }
})

getUserInfo()
