require('./config/config');
require('./db/mongoose');

const express = require('express');
const request = require('request');

const User = require('./db/models/user');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL);
  res.header('Access-Control-Allow-Methods', 'GET, DELETE');
  next();
});

app.get('/', (req, res) => {
  res.send('Test for Webim.ru');
});

app.get('/VKverify', (req, res) => {
  const accessTokenURL = `https://oauth.vk.com/access_token?client_id=${process.env.VK_CLIENT_ID}&client_secret=${process.env.VK_CLIENT_SECRET}&redirect_uri=${process.env.VK_REDIRECT_URI}/VKverify&code=${req.query.code}`;

  request.get(accessTokenURL, (err, response) => {
    const body = JSON.parse(response.body);
    if (err || body.error) {
      return res.status(400).send(err || body.error);
    }

    User.findOrCreate(body['access_token'], body['user_id'])
      .then((user) => {
        res.redirect(`${process.env.CLIENT_URL}/main?vkId=${user.vkId}`);
      })
      .catch(err => {
        res.status(400).send(err);
      })
  })
});

app.get('/VKgetfriends/:vkId', (req, res) => {
  const vkId = req.params['vkId'];

  User.findOne({vkId})
    .then(user => {
      if (!user) {
        return res.status(400).send(`no user with vkId: ${vkId}`);
      }

      const getFriendsURL = `https://api.vk.com/method/friends.get?v=5.101&access_token=${user.vkToken}&order=random&count=5&fields=photo_50,online`;

      request(getFriendsURL, (err, response) => {
          const body = JSON.parse(response.body);
          if (err || body.error) {
            return res.status(400).send(err || body.error);
          }

          res.send(body.response.items);
        }
      )
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

app.delete('/VKlogout/:vkId', (req, res) => {
  const vkId = req.params['vkId'];

  User.findOneAndDelete({vkId})
    .then(user => {
      if (!user) {
        return res.status(404).send(`no user with vkId: ${vkId}`);
      }

      res.status(200).send();
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

app.listen(process.env.PORT);

module.exports = app;
