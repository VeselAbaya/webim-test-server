const env = process.env.NODE_ENV || 'development'; // NODE_ENV - for heroku and defines by heroku

if (env === 'development') {
  const config = {
    "PORT": 3800,
    "MONGODB_URI": "mongodb://localhost:27017/WebimTest",
    "JWT_SECRET": "sdklliej983u45oancgh3478h283foq8743o834go3i4h5mnbdfmvsnlw34"
  };

  Object.keys(config).forEach(key => {
    process.env[key] = config[key]
  })
}
