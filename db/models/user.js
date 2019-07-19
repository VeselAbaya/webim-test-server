const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  vkId: {
    type: String
  },
  vkToken: {
    type: String
  }
});

UserSchema.statics.findOrCreate = (vkToken, vkId) => {
  return User.findOne({vkId})
    .then(user => {
      if (!user) {
        user = new User({vkId, vkToken});
        return user.save();
      }

      return Promise.resolve(user);
    })
    .catch(err => {
      return Promise.reject(err);
    });
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
