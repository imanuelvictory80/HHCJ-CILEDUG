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
        for (var key in dbreturn){
            var ops = [];
            ops.push({
                name: 'Edit/Delete',
                url: 'admin-banquet-detail.html?id='+key
            });
            ops.push({
                name: 'Attendees',
                url: 'admin-banquet-detail-users.html?id='+key
            });
            ops.push({
                name: 'Seating Plan',
                url: 'seatingplan-generation.html?bid='+key
            });
            dbreturn[key].ops = ops;
            dbreturn[key]['showInfoAttr'] = ['beginTime','endTime','location','meal1','meal2','meal3','meal4'];
        }
        document.getElementById("show-banquets-admin").setAttribute("banquets", JSON.stringify(dbreturn));
    });
}

function loadAdminUsers(){
    db.ref('users').on('value', function(snapshot) {
        var dbreturn = snapshot.val();
        db.ref('banquet').on('value', function(snapshot1) {
            var dbreturn1 = snapshot1.val();
            for (var key in dbreturn){
                // var banquetName = dbreturn1[].name;
                var banquetId = dbreturn[key].banquet;
                if (dbreturn1[banquetId] === undefined){
                    var banquetName = 'Banquet Name';
                } else {
                    var banquetName = dbreturn1[banquetId].name;
                }
                var ops = [];
                ops.push({
                    name: 'Edit/Delete',
                    url: 'admin-user-detail.html?id='+key
                });
                ops.push({
                    name: 'All Banquets He/She Joined',
                    url: 'admin-user-detail.html?id='+key
                });
                dbreturn[key].ops = ops;
                dbreturn[key].name = dbreturn[key].first_name + ' ' + dbreturn[key].last_name.toUpperCase();
                dbreturn[key].banquetAndType = banquetName + '('+dbreturn[key].banquet+')' + ' as ' + dbreturn[key].type;
                dbreturn[key]['showInfoAttr'] = ['email','meal','banquetAndType','drink','seat'];
            }
            document.getElementById("show-users-admin").setAttribute("banquets", JSON.stringify(dbreturn));
        });
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

function loadBanquetInfo(id){
    db.ref('banquet/'+id).on('value', function(snapshot) {
        var dbreturn = snapshot.val();
        document.getElementById("banquet-title").value=dbreturn.name;
        document.getElementById("begin-time").value=dbreturn.beginTime;
        document.getElementById("end-time").value=dbreturn.endTime;
        document.getElementById("location").value=dbreturn.location;
        document.getElementById("staff-first-name").value=dbreturn.staffFirstname;
        document.getElementById("staff-last-name").value=dbreturn.staffLastName;
        if (dbreturn.remarks == undefined){
            document.getElementById("remarks").value="";
        } else {
            document.getElementById("remarks").value=dbreturn.remarks;
        }
        document.getElementById("meal1").value=dbreturn.meal1;
        document.getElementById("meal2").value=dbreturn.meal2;
        document.getElementById("meal3").value=dbreturn.meal3;
        document.getElementById("meal4").value=dbreturn.meal4;
        document.getElementById("loader").style="display:none;"
        // document.getElementById("show-users-admin").setAttribute("banquets", JSON.stringify(dbreturn));
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
    var staffFirstName = document.getElementById("staff-first-name").value;
    var staffLastName = document.getElementById("staff-last-name").value;
    var remarks = document.getElementById("remarks").value;
    var meal1 = document.getElementById("meal1").value;
    var meal2 = document.getElementById("meal2").value;
    var meal3 = document.getElementById("meal3").value;
    var meal4 = document.getElementById("meal4").value;
    db.ref('banquet').push({
        name: name,
        beginTime: beginTime,
        endTime : endTime,
        location : location,
        staffFirstname: staffFirstName,
        staffLastName: staffLastName,
        remarks: remarks,
        meal1: meal1,
        meal2: meal2,
        meal3: meal3,
        meal4: meal4
    }).then(res => {
        alert("The new banquet is created!");
    });
}

function dbUpdateBanquet(id){
    var name = document.getElementById("banquet-title").value;
    var beginTime = document.getElementById("begin-time").value;
    var endTime = document.getElementById("end-time").value;
    var location = document.getElementById("location").value;
    var staffFirstName = document.getElementById("staff-first-name").value;
    var staffLastName = document.getElementById("staff-last-name").value;
    var remarks = document.getElementById("remarks").value;
    var meal1 = document.getElementById("meal1").value;
    var meal2 = document.getElementById("meal2").value;
    var meal3 = document.getElementById("meal3").value;
    var meal4 = document.getElementById("meal4").value;
    db.ref('banquet/'+id).set({
        name: name,
        beginTime: beginTime,
        endTime : endTime,
        location : location,
        staffFirstname: staffFirstName,
        staffLastName: staffLastName,
        remarks: remarks,
        meal1: meal1,
        meal2: meal2,
        meal3: meal3,
        meal4: meal4
    }).then(res => {
        alert("The new banquet is updated!");
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