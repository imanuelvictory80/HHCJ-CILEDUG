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
db = firebase.database();

var database = firebase.database();

// document.getElementById("test").addEventListener("click", writeUserData('3','2','3','4'));
// $(document).ready(function(){
//     $("#test").click(function(){
//         writeUserData('4','2','3','4')
//     });
// });

function writeUserData(userId, name, email, imageUrl) {
    firebase.database().ref('users/' + userId).set({
      username: name,
      email: email,
      profile_picture : imageUrl
    });
  }

function loadAdminBanquets(){
    db.ref('banquet').on('value', function(snapshot) {
        console.log(snapshot.val());
    });
}

function dbCreateBanquet(){
    var name = document.getElementById("banquet-title").value;
    var beginTime = document.getElementById("begin-time").value;
    var endTime = document.getElementById("end-time").value;
    var location = document.getElementById("location").value;
    db.ref('banquet').push({
        name: name,
        beginTime: beginTime,
        endTime : endTime,
        location : location
    }).then(res => {
        alert("The new banquet is created!");
    });
}