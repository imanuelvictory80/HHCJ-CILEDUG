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

// exports.syncBanquetName = functions.database.ref('/users/{userID}')
// .onCreate((snapshot, context) => {
// 	const dbdata = snapshot.val();
//     console.log(dbdata.banquet);
//     return snapshot.ref.parent.parent.child('banquet').child(dbdata.banquet).once("value").then(snap => {
//         console.log(snap.val());
//         var banquetName = snap.val().name;
//         console.log(banquetName);
//         return snapshot.ref.child('banquetName').set(banquetName);
//     });
// });

exports.sendRegCfmEmail = functions.database.ref('/users/{userID}')
.onCreate((snapshot, context) => {
	const dbdata = snapshot.val();
	console.log(dbdata);
	var userID = context.params.userID;
	const email = dbdata.email; // The email of the user.
	const displayName = dbdata.first_name + ' ' + dbdata.last_name.toUpperCase(); // The display name of the user.
    return snapshot.ref.parent.parent.child('banquet').child(dbdata.banquet).once("value").then(snap => {
        console.log(snap.val());
        var banquetName = snap.val().name;
        console.log(banquetName);
        sendRegCfmEmail(email, displayName, dbdata, banquetName);
        return snapshot.ref.child('banquetName').set(banquetName);
    });
    // return sendRegCfmEmail(email, displayName, dbdata);
});

exports.sendSeatEmail = functions.database.ref('/users/{userID}/seat')
.onWrite((change, context) => {
    console.log(context.params.userID);
    const seat = change.after.val();
    console.log(seat);
    return change.after.ref.parent.once("value").then(snap => {
        const dbdata = snap.val();
        console.log(dbdata);
        var userID = dbdata.userID;
        const email = dbdata.email; // The email of the user.
        const displayName = dbdata.first_name + ' ' + dbdata.last_name.toUpperCase(); // The display name of the user.
        return sendSeatEmail(email, displayName, dbdata, seat);
    });
});

function sendRegCfmEmail(email, displayName, dbdata, banquetName) {
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
	mailText += `Banquet Name: ${banquetName || dbdata.banquet} \n`;
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

function sendSeatEmail(email, displayName, dbdata, seat) {
	// find corresponding banquet name
    console.log(dbdata.banquet);
	// admin.database().ref('/banquet/'+dbdata.banquet).once('value').then(function(snapshot) {
	// var banquetName = snapshot.val().name;
	const mailOptions = {
		from: `${APP_NAME} <noreply@firebase.com>`,
		to: email,
	};
	mailOptions.subject = `Table confirmed at banquet ${dbdata.banquetName || dbdata.banquet} from ${APP_NAME}!`;
	var mailText = `Dear ${displayName || ''}, \n Your table number if confirmed for the upcoming banquet ${dbdata.banquetName || dbdata.banquet}. \n Your table number is:`;
    mailText += `${seat}\n\n`;
    mailText += `More information about the upcoming banquet: \n`;
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