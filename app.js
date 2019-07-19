require('./config/config');
require('./db/mongoose');

const express = require('express');
const request = require('request');

const User = require('./db/models/user');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/VKverify', (req, res) => {
  const accessTokenURL = `https://oauth.vk.com/access_token?client_id=${process.env.VK_CLIENT_ID}&client_secret=${process.env.VK_CLIENT_SECRET}&redirect_uri=http://localhost:3800/VKverify&code=${req.query.code}`;

  request.get(accessTokenURL, (err, accessTokenResponse) => {
    if (err) {
      res.status(400).send(err);
    }

    const body = JSON.parse(accessTokenResponse.body);
    User.findOrCreate(body['access_token'], body['user_id'])
      .then((user) => {
        res.redirect(`http://localhost:4200/main?vkId=${user.vkId}`);
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
        res.status(400).send(`no user with vkId: ${vkId}`);
      }

      request(
        `https://api.vk.com/method/friends.get?v=5.101&access_token=${user.vkToken}&order=random&count=5&fields=photo_50,online`,
        (err, response) => {
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
