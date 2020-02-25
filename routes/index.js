var express = require('express')
var router = express.Router()

var getProject = cookies => {
  var key = Object.keys(cookies).find(key => {
    return /^auth\./.test(key)
  })
  // auth.abcdef
  return key && key.split('.')[1]
}

router.get('/', function(req, res, next) {
  if (!req.app.locals.project && getProject(req.cookies)) {
    req.app.locals.project = getProject(req.cookies)
  }

  res.render('index', { title: 'Userfront app walkthrough', project: req.app.locals.project })
})

router.post('/project', function(req, res, next) {
  if (!req.app.locals.project) {
    req.app.locals.project = req.body.project
  }

  res.render('index', { title: 'Userfront app walkthrough', project: req.app.locals.project })
})

router.get('/signup', function(req, res, next) {
  var project = req.app.locals.project || getProject(req.cookies)
  res.redirect('/' + project + '/signup')
})

router.get('/:project/signup', function(req, res, next) {
  res.render('signup', {
    title: 'Userfront app walkthrough | Sign up',
  })
})

router.get('/login', function(req, res, next) {
  var project = req.app.locals.project || getProject(req.cookies)
  res.redirect('/' + project + '/login')
})

router.get('/:project/login', function(req, res, next) {
  res.render('login', {
    title: 'Userfront app walkthrough | Log in',
  })
})

router.get('/logout', function(req, res, next) {
  var project = req.app.locals.project || getProject(req.cookies)
  res.redirect('/' + project + '/logout')
})

router.get('/:project/logout', function(req, res, next) {
  res.render('logout', {
    title: 'Userfront app walkthrough | Log out',
  })
})

router.get('/reset', function(req, res, next) {
  var project = req.app.locals.project || getProject(req.cookies)
  res.redirect('/' + project + '/reset')
})

router.get('/:project/reset', function(req, res, next) {
  res.render('password-reset', {
    title: 'Userfront app walkthrough | Password reset',
  })
})

router.get('/profile', function(req, res, next) {
  var project = req.app.locals.project || getProject(req.cookies)
  res.redirect('/' + project + '/profile')
})

router.get('/:project/profile', function(req, res, next) {
  res.render('profile', {
    title: 'Userfront app walkthrough | Profile',
  })
})

module.exports = router
