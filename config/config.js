const env = process.env.NODE_ENV || 'development'; // NODE_ENV - for heroku and defines by heroku

process.env = {
  ...process.env,
  ...require('./config'),
};

if (env === 'development') {
  process.env = {
    ...process.env,
    ...require('./devconfig')
  };
}
else { // production
  process.env = {
    ...process.env,
    "CLIENT_URL": 'https://veselabaya.github.io/webim-test-front'
  }
}
