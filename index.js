const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express();
const server = http.Server(app);
const io = socketio(server);

const title = 'Buffer Buzzer'

let data = {
  users: new Set(),
  buzzes: new Set(),
  scores: {
    mayo: 0,
    ketchup: 0,
  },
}

const getData = () => ({
  users: [...data.users],
  buzzes: [...data.buzzes].map(b => {
    const [ name, team ] = b.split('-')
    return { name, team }
  }),
  scores: data.scores
})

app.use(express.static('public'))
app.set('view engine', 'pug')

// authentication middleware
app.use((req, res, next) => {
  const secureUrls = [
    '/host',
  ]

  if (process.env.BASIC_AUTH_USER && process.env.BASIC_AUTH_PWD && secureUrls.indexOf(req.url) > -1) {
    const auth = {login: process.env.BASIC_AUTH_USER, password: process.env.BASIC_AUTH_PWD}

    // parse login and password from headers
    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')

    // Verify login and password are set and correct
    if (login && password && login === auth.login && password === auth.password) {
      // Access granted...
      return next()
    } else {
      // Access denied...
      res.set('WWW-Authenticate', 'Basic realm="401"')
      res.status(401).send('Authentication required.')
    }
  } else {
    return next()
  }
})

app.get('/', (req, res) => res.render('index', Object.assign({ title }, getData())))
app.get('/host', (req, res) => res.render('host', Object.assign({ title }, getData())))

const join = (user) => {
  data.users.add(user.id)
  io.emit('active', [...data.users].length)
  console.log(`${user.name} joined!`)
}

const buzz = (user) => {
  data.buzzes.add(`${user.name}-${user.team}`)
  io.emit('buzzes', [...data.buzzes])
  console.log(`${user.name} buzzed in!`)

  if (!data.clearTimeout && process.env.CLEAR_BUZZES_TIMEOUT) {
    data.clearTimeout = setTimeout(clear, parseInt(process.env.CLEAR_BUZZES_TIMEOUT))
  }
}

const clear = () => {
  data.buzzes = new Set()
  io.emit('buzzes', [...data.buzzes])
  clearTimeout(data.clearTimeout)
  delete(data.clearTimeout)
  console.log(`Clear buzzes`)
}

const increase = (team) => {
  data.scores[team] = Math.min(data.scores[team] + 1, 25)
  io.emit('scores', data.scores)
  console.log(`${team} score increased!`, data.scores)
}

const decrease = (team) => {
  data.scores[team] = Math.max(data.scores[team] - 1, 0)
  io.emit('scores', data.scores)
  console.log(`${team} score decreased!`, data.scores)
}

const reset = () => {
  data.scores = {
    mayo: 0,
    ketchup: 0,
  }
  io.emit('scores', data.scores)
  console.log(`Scores reset!`, data.scores)
}

io.on('connection', (socket) => {
  socket.on('join', join)
  socket.on('buzz', buzz)
  socket.on('clear', clear)
  socket.on('increase', increase)
  socket.on('decrease', decrease)
  socket.on('reset', reset)
})


server.listen(process.env.PORT || 8090, () => console.log('Listening on http://localhost:8090/'))
