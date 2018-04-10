function guestTypeChange(){
	if(document.getElementById("guest-type").value=='delegate') {
		document.getElementById("remark-label").innerText = "Remark";
		document.getElementById("remark").setAttribute("placeholder","Please comment if you need special care.");
	}
	else{
		document.getElementById("remark-label").innerText = "Special Request";
		document.getElementById("remark").setAttribute("placeholder","Please input if you have special meal or drink request and remarks.");
	}
}

function checkP1(){
	var selectedIndex = -1;
	var radios = document.getElementsByName("banquetRadio");
	var i = 0;
	for (i=0; i < radios.length; i++) {
        if (radios[i].checked) {
			$('.row1').hide(); $('.row2').show();
			selectedIndex = i;
			break;
        }
    }
	if (selectedIndex < 0){
		alert("Please choose the banquet to move on.");
	}
}

function checkP2(){
	var idlist = ["first-name","first-name","guest-type","ao","phone","email"];
	var i;
	var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
	var tel = /^\d{8}$/;
	for(i=0;i<idlist.length;i++){
		if (document.getElementById(idlist[i]).value == null || document.getElementById(idlist[i]).value == "") {
			alert("Please fill all the fields to continue.");
			return;
		}
	}
	/*
	if (getElementById("phone").value.length != 8) {
		alert("Please input a 8-digit Hong Kong phone number.");
		return;
	}*/
	if (!tel.test(document.getElementById("phone").value)) {
		alert("Please input a 8-digit Hong Kong phone number.");
		return ;
	}
	if (!reg.test(document.getElementById("email").value)) {
		alert("Please input a legal email address.");
		return ;
	}
	$('.row2').hide(); $('.row3').show();
}

function checkP3(){
	var mealflag = -1, drinkflag = -1;
	var radios = document.getElementsByName("meal");
	var i = 0;
	for (i=0; i < radios.length; i++) {
        if (radios[i].checked) {
			mealflag = i;
			break;
        }
	}
	radios = document.getElementsByName("drink");
	for (i=0; i < radios.length; i++) {
        if (radios[i].checked) {
			drinkflag = i;
			break;
        }
	}
	if (mealflag < 0){
		alert("Please select one meal.");
		return;
	}
	if (drinkflag < 0){
		alert("Please select one drink.");
		return;
	}
	var remarkcontent = document.getElementById("remark");
	if (remark.value == null || remark.value == ""){
		if(!confirm("Are you sure to submit without remark?")) return ;
	}
	
	if(!confirm("Are you sure to submit your registration?")) return ;
	//$('.row3').hide(); $('.row4').show();
	window.onbeforeunload = null;
	document.getElementById("attendee-reg").submit();
	alert("Your registration has been successfully submitted!\n\nPlease remember your email [ " + document.getElementById("email").value + " ] which will be your identification for further needs.");
	self.location='index.html';
}

$(document).ready(
	function(){
		$("#table-selector td").click(
			function(){
				$(this).parent().find("input:radio").prop("checked",true);
				//alert($(this).parent().find("input:radio").attr("checked"));
			}
		)
	},
	function(){
		$(".meal-choice-div").click(
			function(){
				$(this).find("input:radio").prop("checked",true);
				//alert($(this).parent().find("input:radio").attr("checked"));
			}
		)
	}
);


