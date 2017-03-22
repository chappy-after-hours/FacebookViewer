const express = require('express');
const session = require('express-session');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook');
const bodyParser = require('body-parser');
const config = require('./configIt')
const port = 8000;


const app = express();

app.use(bodyParser.json());
app.use(session({
  secret: config.secret,
  saveUninitialized: false,
  resave: true
}));
app.use(passport.initialize());
app.use(passport.session());


passport.use('facebook', new FacebookStrategy({
  clientID: config.appID,
  clientSecret: config.appSecret,
  callbackURL: 'http://localhost:8000/auth/facebook/callback',
  profileFields: ['id', 'displayName']
},
  function(token, refreshToken, profile, done){
    return done(null, profile);
}));

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook',
  { successRedirect:'/me',
    failureRedirect: '/login'}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


app.get('/me', function(req, res) {
  console.log(req.user);
  res.send(req.user);
})

app.get('/auth/logout', function(req, res) {
  req.logout();
  res.redirect('/');
})

app.listen(port, function() {
  console.log(`app listening on port ${port}`);
})
