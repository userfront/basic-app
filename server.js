const createError = require('http-errors')
const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

function getPage(pageName, projectId) {
  return new Promise(resolve => {
    fs.readFile('./pages/' + pageName + '.html', 'utf8', (err, data) => {
      if (err) {
        return console.error(err)
      }

      const result = data.replace(/PROJECT_ID/g, projectId)
      resolve(result)
    })
  })
}

app.get('/', (req, res) => {
  fs.readFile('./pages/index.html', 'utf8', (err, data) => {
    if (err) {
      return console.log(err)
    }

    res.send(data)
  })
})

app.post('/project', (req, res) => {
  if (!req.app.locals.project) {
    req.app.locals.project = req.body.project
  }

  res.redirect(req.body.project + '/signup')
})

app.get('/:projectId/signup', async (req, res) => {
  const page = await getPage('signup', req.params.projectId)
  res.send(page)
})

app.get('/:projectId/login', async (req, res) => {
  const page = await getPage('login', req.params.projectId)
  res.send(page)
})

app.get('/:projectId/reset', async (req, res) => {
  const page = await getPage('reset', req.params.projectId)
  res.send(page)
})

app.get('/:projectId/home', async (req, res) => {
  const page = await getPage('home', req.params.projectId)
  res.send(page)
})

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// Create server
const http = require('http')
const port = process.env.PORT || '3333'
app.set('port', port)
const server = http.createServer(app)
server.listen(port, () => {
  console.log('Server running on port %s', port)
})
