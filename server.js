const fs = require('fs')
const path = require('path')
const express = require('express')
const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

function getPage(pageName) {
  return new Promise(resolve => {
    fs.readFile('./pages/' + pageName + '.html', 'utf8', (err, data) => {
      if (err) {
        return console.error(err)
      }

      // Replace project ID or default to demo project
      const result = data.replace(/PROJECT_ID/g, app.locals.projectId || 'g48xypb9')
      resolve(result)
    })
  })
}

// Set projectId from subdomain
app.use(function(req, res, next) {
  app.locals.projectId = req.subdomains.length ? req.subdomains[req.subdomains.length - 1] : ''
  next()
})

app.get('/', (req, res) => {
  fs.readFile('./pages/index.html', 'utf8', (err, data) => {
    if (err) {
      return console.log(err)
    }

    res.send(data)
  })
})

app.get('/signup', async (req, res) => {
  const page = await getPage('signup')
  res.send(page)
})

app.get('/login', async (req, res) => {
  const page = await getPage('login')
  res.send(page)
})

app.get('/reset', async (req, res) => {
  const page = await getPage('reset')
  res.send(page)
})

app.get('/home', async (req, res) => {
  const page = await getPage('home')
  res.send(page)
})

// Create server
const http = require('http')
const port = process.env.PORT || '3333'
app.set('port', port)
const server = http.createServer(app)
server.listen(port, () => {
  console.log('Server running on port %s', port)
})
