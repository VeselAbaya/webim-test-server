require('./config/config');

const express = require('express');
const passport = require('passport');
const VKontakteStrategy = require('passport-vkontakte').Strategy;

const User = require('./db/models/user');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());

// passport.use(new VKontakteStrategy({
//     clientID:     VKONTAKTE_APP_ID, // VK.com docs call it 'API ID', 'app_id', 'api_id', 'client_id' or 'apiId'
//     clientSecret: VKONTAKTE_APP_SECRET,
//     callbackURL:  `http://localhost:${process.env.PORT}/auth/vkontakte/callback`
//   },
//   (accessToken, refreshToken, params, profile, done) => {
//
//     // Now that we have user's `profile` as seen by VK, we can
//     // use it to find corresponding database records on our side.
//     // Also we have user's `params` that contains email address (if set in
//     // scope), token lifetime, etc.
//     // Here, we have a hypothetical `User` class which does what it says.
//     User.findOrCreate(profile.id)
//       .then(function (user) { done(null, user); })
//       .catch(done);
//   }
// ));
//
// // User session support for our hypothetical `user` objects.
// passport.serializeUser(function(user, done) {
//   done(null, user._id);
// });
//
// passport.deserializeUser(function(id, done) {
//   User.findById(id)
//     .then(function (user) { done(null, user); })
//     .catch(done);
// });

app.get('/', (req, res) => {
  res.send("I'm alive");
});

app.listen(process.env.PORT, () => {
  console.log(`Webim test server started up on port ${process.env.PORT}`)
});

module.exports = app;
