const env = process.env.NODE_ENV || 'development'; // NODE_ENV - for heroku and defines by heroku

process.env = {
  ...process.env,
  ...require('./config.json'),
};

if (env === 'development') {
  process.env = {
    ...process.env,
    ...require('./devconfig.json')
  };
}
else { // production
  process.env = {
    ...process.env,
    ...require('./prodconfig.json')
  }
}
