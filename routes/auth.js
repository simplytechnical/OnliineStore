var express = require('express');
var router = express.Router();
var passport = require('passport');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

// middelwares start
const isNotAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect('/');
  }
  next();
};
const isAuth = (req, res, next) => {
  if(!req.isAuthenticated()) {
    renderAuthPage(req, res, 'User isn\'t authenticated');
  }
  next();
};
// middelwares end

router.get('/auth', isNotAuth, (req, res) => {
  console.log(req.isAuthenticated());
  
  renderAuthPage(req, res, null);
});
router.post('/signup', isNotAuth, async (req, res) => {
    try {
      const password = await bcrypt.hash(req.body.password, 10);
      const user = await prisma.user.create({
        data: {
          email: req.body.email,
          password,
          active: true
        }
      });
    res.send(user);

    } catch (error) {
      if (error.meta && error.meta.target.includes('email')) {
        renderAuthPage(req, res, 'Email used by another user');
      } else {
        res.send({error, message: 'Unkown error'});
      }
    }
});
router.post('/login', isNotAuth, passport.authenticate('local', { failureRedirect: '/auth' }),
  function(req, res) {
    res.redirect('/');
  }
);

router.get('/',isAuth ,(req, res) => {
  res.render('index');
});

router.get('/auth/facebook',
  passport.authenticate('facebook', { scope : ['email'] }));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/auth', successRedirect: '/' }));

router.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user' ] }));

router.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/auth' , successRedirect: '/' }));

router.get('/auth/amazon',
  passport.authenticate('amazon', { scope: [ 'profile' ] }));

router.get('/auth/amazon/callback', 
  passport.authenticate('amazon', { failureRedirect: '/auth' , successRedirect: '/' }));

router.get('/auth/twitter',
  passport.authenticate('twitter', { scope : ['email'] }));

router.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/auth' , successRedirect: '/' }));

module.exports = router;
function renderAuthPage(req, res, error) {
  const lang = req.cookies.lang;
  if (lang) {
    res.setLocale(lang);
  }
  const pageTitle = res.__('Auth');
  let dir;
  if (lang == 'ar') {
    dir = res.__('rtl');
  }
  else {
    dir = res.__('ltr');
  }

  if (error) {
    error = res.__(error);
  }
  res.render('auth', {lang, dir, error});
}


