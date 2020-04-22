class Sound {
  constructor(src) {
    this.sound = document.createElement('audio');
    this.sound.src = src;
    this.sound.setAttribute('preload', 'auto');
    this.sound.setAttribute('controls', 'none');
    this.sound.style.display = 'none';
    document.body.appendChild(this.sound);
  }

  play = () => this.sound.play()
}

const mayoBuzz = new Sound('mayo.ogg')
const ketchupBuzz = new Sound('ketchup.ogg')
const socket = io()
const active = document.querySelector('.js-active')
const buzzList = document.querySelector('.js-buzzes')
const clear = document.querySelector('.js-clear')

socket.on('active', (numberActive) => {
  active.innerText = `${numberActive} joined`
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

clear.addEventListener('click', () => {
  socket.emit('clear')
})

document.addEventListener('keydown', function(e) {
  if (e.which == 32) {
    socket.emit('clear')
  }
})
