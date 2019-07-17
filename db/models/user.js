const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  vkontakteId: {
    type: String
  }
});

UserSchema.statics.findOrCreate = (vkontakteId) => {
  User.findOne({vkontakteId}, (err, user) => {
    if (!user) {
      return Promise.reject(`No user with vkId: ${vkontakteId}`);
    }

    return Promise.resolve(user);
  })
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
