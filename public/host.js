const active = document.querySelector('.js-active')
const buzzList = document.querySelector('.js-buzzes')
const clear = document.querySelector('.js-clear')
const scoresContainer = document.querySelector('.scores')
const reset = document.querySelector('.js-reset')

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

teams.forEach((team) => {
  const decScore = scoresContainer.querySelector(`.${team} .js-score-minus`)
  const incScore = scoresContainer.querySelector(`.${team} .js-score-plus`)

  decScore.addEventListener('click', () => {
    socket.emit('decrease', team)
  })

  incScore.addEventListener('click', () => {
    socket.emit('increase', team)
  })
})

socket.on('scores', (scores) => {
  teams.forEach((team) => {
    const score = scoresContainer.querySelector(`.${team} .score`)

    score.innerText = scores[team]
  })
})

reset.addEventListener('click', () => {
  socket.emit('reset')
})
