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

var mealIDs = [];
var mealNames = [];

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
        var dbreturn = snapshot.val();
        document.getElementById("show-banquets-admin").setAttribute("banquets", JSON.stringify(dbreturn));
    });
}

function loadAdminUsers(){
    db.ref('users').on('value', function(snapshot) {
        var dbreturn = snapshot.val();
        document.getElementById("show-users-admin").setAttribute("banquets", JSON.stringify(dbreturn));
    });
}

function loadMeals(){
    // console.log('start!!!');
    db.ref('meal').on('value', function(snapshot) {
        var dbreturn = snapshot.val();
        html = '<div class="card-columns">';
        mealIDs = [];
        mealNames = [];
        for (var key in dbreturn){
            mealIDs.push(key);
            mealNames.push(dbreturn[key].name);
            html += '<div class="card">'+
                        '<div class="card-body">'+
                            '<h5 class="card-title">ID: '+key+'</h5>'+
                            '<h6 class="card-subtitle mb-2 text-muted">Name: '+dbreturn[key].name+'</h6>'+
                            '<p class="card-text">Category: '+dbreturn[key].category+'</p>'+
                        '</div>'+
                    '</div>';
        }
        html += '<div>'
        // console.log(html);
        document.getElementById("meal-choices").innerHTML = html;
    });
}

function mealNumChange(c){
    var t = "Please input meal ID";
    if (include(mealIDs, c.value)){
        t = mealNames[mealIDs.indexOf(c.value)];
        document.getElementById("submit-btn").disabled=false;
    } else {
        document.getElementById("submit-btn").disabled=true;
    }
	$("#"+c.id).next().prop("placeholder",t);
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

function updateGradeList(selectedList){
    // for show-banquets-admin.html module
    // console.log(selectedList);
    document.getElementById('show-banquets-admin').setAttribute('_return_info_list',JSON.stringify(selectedList));
}

// UTIL

function include(arr,obj) {
    return (arr.indexOf(obj) != -1);
}