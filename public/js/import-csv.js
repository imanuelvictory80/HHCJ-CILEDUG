// Get a reference to the database service
var database = firebase.database();

function readFile(){
	var selectedFile = document.getElementById('files').files[0];
	if(selectedFile==null)return;
	var name = selectedFile.name;//读取选中文件的文件名
	var size = selectedFile.size;//读取选中文件的大小
	console.log("文件名:"+name+"大小:"+size);

	var reader = new FileReader();//这是核心,读取操作就是由它完成.
	reader.readAsText(selectedFile);//读取文件的内容,也可以读取文件的URL
	reader.onload = function () {
		//当读取完成后回调这个函数,然后此时文件的内容存储到了result中,直接操作即可
		dealCSV(this.result);
	}
}

function dealCSV(text){
	var lines, values;
	lines=text.split(/\r?\n/);
	text.replace('\t',',');
	var i,count=0;
	var attendeeRefKey;
	var userInfo = {};
	var updates = {};
	for(i=0;i<lines.length;i++){
		lines[i].replace('\n','');
		lines[i].replace('\r','');
		values=lines[i].split(',');
		if(values.length<10){
			console.log("Invalid user at line "+(i+1)+' ('+values.length+').');
			continue;
		}
		attendeeRefKey = database.ref('users').push().key;
		userInfo = {};
		updates = {};
		userInfo['banquet'] = values[0];
		userInfo['first_name'] = values[1];
		userInfo['last_name'] = values[2];
		userInfo['type'] = values[3];
		userInfo['company'] = values[4];
		userInfo['phone'] = values[5];
		userInfo['email'] = values[6];
		userInfo['meal'] = values[7];
		userInfo['drink'] = values[8];
		userInfo['remark'] = values[9];
		updates['/users/' + attendeeRefKey] = userInfo;
		console.log(userInfo);
		firebase.database().ref().update(updates).then(function(){count+=1;document.getElementById('counter').innerText=''+count+' user(s) added.';});
	}
}

function regSubmit(){
	var attendeeRefKey = database.ref('users').push().key;
	var userInfo = {};
	var updates = {};
	userInfo['banquet'] = getRadioBoxValue('banquetRadio');
	userInfo['first_name'] = document.getElementById('first-name').value;
	userInfo['last_name'] = document.getElementById('last-name').value;
	userInfo['type'] = document.getElementById('guest-type').value;
	userInfo['company'] = document.getElementById('ao').value;
	userInfo['phone'] = document.getElementById('phone').value;
	userInfo['email'] = document.getElementById('email').value;
	userInfo['meal'] = getRadioBoxValue('meal');
	userInfo['drink'] = getRadioBoxValue('drink');
	userInfo['remark'] = document.getElementById('remark').value;
	updates['/users/' + attendeeRefKey] = userInfo;
  	firebase.database().ref().update(updates);
}

