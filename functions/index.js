'use strict';

const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

const gmailEmail = "hotel.iconia@gmail.com";
const gmailPassword = "doweb666";
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
	user: gmailEmail,
	pass: gmailPassword,
  },
});

const APP_NAME = 'Hotel ICONIA';

exports.sendRegCfmEmail = functions.database.ref('/users/{userID}')
.onCreate((snapshot, context) => {
	const dbdata = snapshot.val();
	console.log(dbdata);
	var userID = context.params.userID;
	const email = dbdata.email; // The email of the user.
	const displayName = dbdata.first_name + ' ' + dbdata.last_name.toUpperCase(); // The display name of the user.
	return sendRegCfmEmail(email, displayName, dbdata);
});

function sendRegCfmEmail(email, displayName, dbdata) {
	const mailOptions = {
		from: `${APP_NAME} <noreply@firebase.com>`,
		to: email,
	};
	mailOptions.subject = `Registration Confirmation from ${APP_NAME}!`;
	mailOptions.text = `Dear ${displayName || ''}, \n Thanks for your registration at ${APP_NAME}. \n Here is detailed information about your registration: \n`;
	return mailTransport.sendMail(mailOptions).then(() => {
		return console.log('New regcfm email sent to:', email);
	});
}