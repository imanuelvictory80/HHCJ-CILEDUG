// Initialize Firebase
var config = {
    apiKey: "AIzaSyA7nsxerdiRCaYHMOi1ntCvv5GgAfqWd-s",
    authDomain: "banquet-system.firebaseapp.com",
    databaseURL: "https://banquet-system.firebaseio.com",
    projectId: "banquet-system",
    storageBucket: "banquet-system.appspot.com",
    messagingSenderId: "78359664414"
};
firebase.initializeApp(config);

var database = firebase.database();

// document.getElementById("test").addEventListener("click", writeUserData('3','2','3','4'));
$(document).ready(function(){
    $("#test").click(function(){
        writeUserData('4','2','3','4')
    });
});

function writeUserData(userId, name, email, imageUrl) {
    console.log("1");
    firebase.database().ref('users/' + userId).set({
      username: name,
      email: email,
      profile_picture : imageUrl
    });
  }