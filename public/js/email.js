/*
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const rp = require('request-promise');
//google account credentials used to send email
const mailTransport = nodemailer.createTransport('smtps://user@domain.com:password@smtp.gmail.com');

sendEmail('recipient@gmail.com')

// Send email function
function sendEmail(email, body) {
  const mailOptions = {
    from: `<noreply@domain.com>`,
    to: email
  };
  // hmtl message constructions
  mailOptions.subject = 'contact form message';
  mailOptions.html = `<p><b>Name: </b>${body.rsName}</p>
                      <p><b>Email: </b>${body.rsEmail}</p>
                      <p><b>Subject: </b>${body.rsSubject}</p>
                      <p><b>Message: </b>${body.rsMessage}</p>`;
  return mailTransport.sendMail(mailOptions);
}
*/
var email = document.getElementsById('email');
var actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be whitelisted in the Firebase Console.
    url: 'https://banquet-system.firebaseapp.com',
    // This must be true.
  };

  firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
  .then(function() {
    // The link was successfully sent. Inform the user.
    // Save the email locally so you don't need to ask the user for it again
    // if they open the link on the same device.
    window.localStorage.setItem('emailForSignIn', email);
  })
  .catch(function(error) {
    // Some error occurred, you can inspect the code: error.code
  });

  // Confirm the link is a sign-in with email link.
if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
    // Additional state parameters can also be passed via URL.
    // This can be used to continue the user's intended action before triggering
    // the sign-in operation.
    // Get the email if available. This should be available if the user completes
    // the flow on the same device where they started it.
    var email = window.localStorage.getItem('emailForSignIn');
    if (!email) {
      // User opened the link on a different device. To prevent session fixation
      // attacks, ask the user to provide the associated email again. For example:
      email = window.prompt('Please provide your email for confirmation');
    }
    // The client SDK will parse the code from the link for you.
    firebase.auth().signInWithEmailLink(email, window.location.href)
      .then(function(result) {
        // Clear email from storage.
        window.localStorage.removeItem('emailForSignIn');
        // You can access the new user via result.user
        // Additional user info profile not available via:
        // result.additionalUserInfo.profile == null
        // You can check if the user is new or existing:
        // result.additionalUserInfo.isNewUser
      })
      .catch(function(error) {
        // Some error occurred, you can inspect the code: error.code
        // Common errors could be invalid email and invalid or expired OTPs.
      });
  }