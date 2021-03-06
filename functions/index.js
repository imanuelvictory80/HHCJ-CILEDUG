'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp(functions.config().firebase);

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
	// find corresponding banquet name
	console.log(dbdata.banquet);
	// admin.database().ref('/banquet/'+dbdata.banquet).once('value').then(function(snapshot) {
	// var banquetName = snapshot.val().name;
	const mailOptions = {
		from: `${APP_NAME} <noreply@firebase.com>`,
		to: email,
	};
	mailOptions.subject = `Registration Confirmation from ${APP_NAME}!`;
	var mailText = `Dear ${displayName || ''}, \n Thanks for your registration at ${APP_NAME}. \n Here is detailed information about your registration: \n\n`;
	mailText += `Banquet Name: ${dbdata.banquetName || dbdata.banquet} \n`;
	mailText += `Your type: ${dbdata.type || ''} \n`;
	mailText += `Your meal choice: ${dbdata.meal || ''} \n`;
	mailText += `Your drink choice: ${dbdata.drink || ''} \n`;
	mailText += `Your seat number: ${dbdata.seat || 'Not assigned yet (Adminitrator will assign seat later)'} \n\n`;
	mailText += `For assistant, please contact manager for this banquet: \n`;
	mailText += `Yufan Zhuang, +852 82522528, zhuang@iconia.com\n`;
	mailOptions.text = mailText;
	return mailTransport.sendMail(mailOptions).then(() => {
		return console.log('New regcfm email sent to:', email);
	});
	// });
}