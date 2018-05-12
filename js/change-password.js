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

var displayName;
var adminEmail='';
var emailVerified;
var photoURL;
var isAnonymous;
var uid;
var providerData;
var userPointer;

firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		// User is signed in.
		userPointer = user;
		displayName = user.displayName;
		adminEmail = user.email;
		emailVerified = user.emailVerified;
		photoURL = user.photoURL;
		isAnonymous = user.isAnonymous;
		uid = user.uid;
		providerData = user.providerData;
		document.getElementById('admin-email').innerText =  '['+adminEmail+'] Logout';
		document.getElementById('manager-btn').setAttribute('onclick',"javascript: Logout();");
		// ...
	} else {
		// User is signed out.
		adminEmail='';
		if(userPointer==null){
			window.location.href = 'index.html';
		}
		//userPointer=null;
	}
});


function UpdatePassword(){
	var oldpass = document.getElementById('oldpass').value;
	var newpass1 = document.getElementById('newpass1').value;
	var newpass2 = document.getElementById('newpass2').value;
	var errorflag = false;
	if(newpass1 != newpass2){
		alert("The two passwords are inconsistent. Please check your input.");
		window.location.href = 'update-password.html';
		return;
	}
	if(!confirm("Your current account will be signed out. Are you sure to continue?")) return;
	firebase.auth().signOut().then(function() {
		// Sign-out successful.
		firebase.auth().signInWithEmailAndPassword(adminEmail, oldpass)
		.then(function(){
			userPointer.updatePassword(newpass1)
			.then(function(){
				alert("Your password has been updated successfully.");
				firebase.auth().signInWithEmailAndPassword(adminEmail, newpass1)
				.then(function(){
					self.location='manage.html'
				})
				.catch(function(error) {
					// Handle Errors here.
					var errorCode = error.code;
					var errorMessage = error.message;
					if (errorCode === 'auth/wrong-password') {
						alert('Wrong current password.');
						console.log('['+error.code+'] '+error.message);
						self.location='index.html';
						return ;
					}
					else if(errorCode === 'auth/user-not-found') {
						window.location.href = 'admin-login.html';
						return ;
					}
					else if(errorCode === 'auth/network-request-failed'){
						alert('Please access this function under the firebase environment.\n\n'+'['+error.code+'] '+error.message);
						return ;
					}
					else {
						alert('['+error.code+'] '+error.message);
						console.log('['+error.code+'] '+error.message);
						return ;
					}
				});
			})
			.catch(function(error) {
				// An error happened.
				alert('['+error.code+'] '+error.message);
				console.log('['+error.code+'] '+error.message);
				errorflag = true;
			});
		})
		.catch(function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			if (errorCode === 'auth/wrong-password') {
				alert('Wrong current password.');
				console.log('['+error.code+'] '+error.message);
				errorflag = true;
				return ;
			}
			else if(errorCode === 'auth/network-request-failed'){
				alert('Please access this function under the firebase environment.\n\n'+'['+error.code+'] '+error.message);
				return ;
			}
			else if(errorCode === 'auth/user-not-found') {
				window.location.href = 'admin-login.html';
				errorflag = true;
				return ;
			}
			else if(errorCode === 'auth/network-request-failed'){
				alert('Please access this function under the firebase environment.\n'+'['+error.code+'] '+error.message);
				errorflag = true;
				return ;
			}
			else {
				alert('['+error.code+'] '+error.message);
				console.log('['+error.code+'] '+error.message);
				return ;
			}
		});
	}).catch(function(error) {
		// An error happened.
		alert('['+error.code+'] '+error.message);
		console.log('['+error.code+'] '+error.message);
	});
}