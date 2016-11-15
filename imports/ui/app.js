import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import "./app.html";
import { Accounts } from 'meteor/accounts-base';

// configuration
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});

// helpers
Template.registerHelper('eq', function (a, b) {
  return a === b;
});

Template.registerHelper('selectedUser', function () {
  console.log('Selected user ', Session.get('selectedUser'));
  return Session.get('selectedUser');
});

Template.registerHelper('formatDate', function (date) {
  if (moment) {
    return moment(date).format('dddd, DD.MM.YYYY HH:mm');
  } else {
    return date;
  }
});

// generic show message function
showMessage = function (messageText, type) {
  $('#messages').html(messageText).addClass(type).fadeIn();
  setTimeout(function () {
    $('#messages').fadeOut();
  }, 5000);
};