const express = require('express');
const router = express.Router({mergeParams:true});
const user = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const {saveRedirectUrl} = require('../middleware.js')
router.get('/signup',(req,res)=>{
  res.render('users/signup')
})

router.post('/signup', wrapAsync(async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if email is already in use
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      req.flash('error', 'Email is already in use. Please choose another.');
      return res.redirect('/signup');
    }

    // If email is unique, proceed with registration
    const newUser = new user({ email, username });
    const registeredUser = await user.register(newUser, password);

    // Log the user in after successful registration
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash('success', 'Welcome to Wanderlust!');
      res.redirect('/listings');
    });

  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/signup');
  }
}));


router.get('/login',(req,res)=>{
  res.render('users/login.ejs')
})

router.post('/login', saveRedirectUrl,
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }),
  (req, res) => {
   
    req.flash('success', 'Welcome to app');
    res.redirect(res.locals.redirectUrl || '/listings'); // Fallback if redirectUrl is not set
  }
);

router.get('/logout',(req,res,next)=>{
  req.logOut((err)=>{
    if(err){
      return next(err)
    }
    req.flash('success','You are logged out')
    res.redirect('/listings')
  })
})

module.exports = router;