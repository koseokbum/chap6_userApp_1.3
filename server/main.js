import { Meteor } from 'meteor/meteor';
import { MessagesCollection } from "../imports/api/collections.js";
if (ServiceConfiguration.configurations.find({
    service: 'facebook'
  }).count() === 0) {
  ServiceConfiguration.configurations.insert({
    service: 'facebook',
    appId: 'OAuth-credentials-from-facebook',
    secret: 'OAuth-credentials-from-facebook',
    loginStyle: 'popup'
  });
}

Accounts.onCreateUser(function (options, user) {
  if (options.profile) {
    user.profile = options.profile;
  } else {
    user.profile = {};
  }
  user.profile.rank = 'White belt';
  if (options.email) {
    Meteor.setTimeout(function () {
      Accounts.sendVerificationEmail(user._id);
    }, 2 * 1000);
  }
  if (user.services.facebook) {
    user.profile.first_name = user.services.facebook.first_name;
    user.profile.last_name = user.services.facebook.last_name;
    user.profile.gender = user.services.facebook.gender;
  }
  return user;
});

MessagesCollection.allow({
  insert: function (userId, doc) {
    return userId;
  },
  update: function (userId, doc) {
    return true;
  },
  remove: function (userId, doc) {
    return doc.recipient === userId;
  }
});

MessagesCollection.deny({
  insert: function (userId, doc) {
    var fieldsInDoc = _.keys(doc);
    var validFields = ['sender', 'recipient', 'timestamp', 'message', '_id'];
    if (_.difference(fieldsInDoc, validFields).length > 0) {
      console.log('additional fields found');
      return true;
    } else {
      console.log('all fields good');
      return false
    }
  },
  remove: function (userId, doc) {
    return doc.recipient !== userId;
  }
});

Meteor.users.allow({
  remove: function (userId, doc) {
    return doc._id === userId;
  }
});