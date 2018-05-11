function printPDF() {
    var doc = new jsPDF();
    doc.setFont("times", "normal");
    doc.setFontSize(20);
    doc.text(10,10,'Report for Internal Use');
    doc.setFontSize(12);

    //Check for checkboxes
    var selchbox = [];        // array that will store the value of selected checkboxes
    var inpfields = document.getElementsByTagName('input');
    var nr_inpfields = inpfields.length;
    var ycount = 20;

    // traverse the inpfields elements, and adds the value of selected (checked) checkbox in selchbox
    for(var i=0; i<nr_inpfields; i++) {
        if(inpfields[i].type == 'checkbox' && inpfields[i].checked == true) selchbox.push(inpfields[i].value);
    }
    
    //Read data from the database
    var dataARR = new Array(100);
    for (var i = 0; i < 101; i++) {
        dataARR[i] = new Array(100);
        for (var j = 0; j < 100; j++) {
            dataARR[i][j] = 0;
        }
    }

    var database = firebase.database();
    var attendee = database.ref('users').orderByKey();
    attendee.on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var val = childSnapshot.val();
            var table = 1;
            var meal = parseInt(val["meal"]);
            dataARR[table][meal] += 1;
            dataARR[100][1] = -1;
        });
        doc.text(10, ycount, "For banquet " ); ycount += 5;
        for (var j = 0; j < 100; j++) {
            for (var k = 0; k < 100; k++) {
                if (dataARR[j][k] > 0) {
                    doc.text(10, ycount, "For table " + j + ", " + dataARR[j][k] + " meal " + k + " is ordered.");
                    ycount +=5 ;
                }
            }
        }
        console.log(dataARR);
        //Create PDF as needed
        doc.save();
    });
}

function startGenerateReport(){
    var checkboxes = document.getElementsByClassName('banquetCheckbox');
    var selectedBanquetsID = [];
    for (var ele in checkboxes) {
        if (checkboxes[ele].tagName && checkboxes[ele].checked) {
            selectedBanquetsID.push(checkboxes[ele].id);
        }
    }
    console.log('selected banquets', selectedBanquetsID);
    // printPDF();
    countChoices(selectedBanquetsID);
}

async function filterAttendeeByBanquet(attendee, selectedBanquetsID){
    // return new Promise(resolve => {
        var filteredAttendee = {};
        for (var key in attendee){
            var value = attendee[key];
            if (include(selectedBanquetsID,value.banquet) === true){
                filteredAttendee[key] = value;
            }
        }
        // resolve(filteredAttendee);
        return filteredAttendee;
    // });
}

async function countChoices(selectedBanquetsID){
    var database = firebase.database();
    database.ref('users').on('value', function(snapshot) {
        var attendee = snapshot.val();
        var mealReport = {};
        var drinkReport = {};
        // var filteredAttendee = await filterAttendeeByBanquet(attendee, selectedBanquetsID);
        var filteredAttendee = attendee;
        for (var key in filteredAttendee){
            var value = filteredAttendee[key];
                if (value.seat != undefined){
                    if (mealReport[value.meal] == undefined){
                        mealReport[value.meal] = {};
                    }
                    if (mealReport[value.meal][value.banquet] == undefined){
                        mealReport[value.meal][value.banquet] = {};
                    }
                    if (mealReport[value.meal][value.banquet][value.seat] == undefined){
                        mealReport[value.meal][value.banquet][value.seat] = [];
                    }
                    mealReport[value.meal][value.banquet][value.seat].push(value.first_name+' '+value.last_name.toUpperCase());
                }
                if (value.seat != undefined){
                    if (drinkReport[value.drink] == undefined){
                        drinkReport[value.drink] = {};
                    }
                    if (drinkReport[value.drink][value.banquet] == undefined){
                        drinkReport[value.drink][value.banquet] = {};
                    }
                    if (drinkReport[value.drink][value.banquet][value.seat] == undefined){
                        drinkReport[value.drink][value.banquet][value.seat] = [];
                    }
                    drinkReport[value.drink][value.banquet][value.seat].push(value.first_name+' '+value.last_name.toUpperCase());
                }
        }
        // console.log(mealReport);
        // console.log(drinkReport);
        postFilter(mealReport, drinkReport, selectedBanquetsID);
        showReport(mealReport, drinkReport);
    });
}

function postFilter(mealReport, drinkReport, selectedBanquetsID){
    var newmealreport = {};
    var newdrinkreport = {};
    for (var key in mealReport){
        for (var key1 in mealReport[key]){
            if (include(selectedBanquetsID,key1)){
                newmealreport[key] = {};
                newmealreport[key][key1] = mealReport[key][key1];
            }
        }
    }
    for (var key in drinkReport){
        for (var key1 in drinkReport[key]){
            if (include(selectedBanquetsID,key1)){
                newdrinkreport[key] = {};
                newdrinkreport[key][key1] = drinkReport[key][key1];
            }
        }
    }
    // console.log(newmealreport);
    // console.log(newdrinkreport);
    showReport(newmealreport, newdrinkreport);
}

function showReport(mealReport, drinkReport){
    var chart_array_meal = [];
    chart_array_meal.push(["Meal", "Amount Needed"]);
    var chart_array_drink = [];
    chart_array_drink.push(["Drink", "Amount Needed"]);
    document.getElementById('report').style.display = 'block';
    htmlMeal = '<table class="table table-hover mt-3">' +
                '<tr><th>Meal</th><th>Total Number</th><th>Banquet</th><th>Table</th><th>Attendee Name</th>'+
                '</tr>';
    // console.log(mealReport);
    for (var keyMeal in mealReport){
        var numInMeal = 0;
        var htmlBanquet = '';
        // count number of customer
        // count number of 
        for (var keyBanquet in mealReport[keyMeal]){
            var numInBanquet = 0;
            var htmlTable = '';
            for (var keyTable in mealReport[keyMeal][keyBanquet]){
                var numInTable = mealReport[keyMeal][keyBanquet][keyTable].length;
                var htmlAttendee = '';
                var i = 0;
                mealReport[keyMeal][keyBanquet][keyTable].forEach(function(element){
                    if (i==0){
                        htmlAttendee += '<td>'+element+'</td></tr>';
                    } else {
                        htmlAttendee += '<tr><td>'+element+'</td></tr>';
                    }
                });
                numInBanquet += numInTable;
                htmlTable += '<td rowspan="'+numInTable+'">'+keyTable+'</td>' + htmlAttendee;
            }
            numInMeal += numInBanquet;
            htmlBanquet += '<td rowspan="'+numInBanquet+'">'+keyBanquet+'</td>' + htmlTable;
        }
        htmlMeal += '<tr>'+
                    '<td rowspan="'+numInMeal+'">'+keyMeal+'</td><td rowspan="'+numInMeal+'">'+numInMeal+'</td>' + htmlBanquet;
        chart_array_meal.push([keyMeal, numInMeal]);

    }
    htmlDrink = '<table class="table table-hover mt-3">' +
                '<tr><th>Drink</th><th>Total Number</th><th>Banquet</th><th>Table</th><th>Attendee Name</th>'+
                '</tr>';

    for (var keyMeal in drinkReport){
        var numInMeal = 0;
        var htmlBanquet = '';
        // count number of customer
        // count number of 
        for (var keyBanquet in drinkReport[keyMeal]){
            var numInBanquet = 0;
            var htmlTable = '';
            for (var keyTable in drinkReport[keyMeal][keyBanquet]){
                var numInTable = drinkReport[keyMeal][keyBanquet][keyTable].length;
                var htmlAttendee = '';
                var i = 0;
                drinkReport[keyMeal][keyBanquet][keyTable].forEach(function(element){
                    if (i==0){
                        htmlAttendee += '<td>'+element+'</td></tr>';
                    } else {
                        htmlAttendee += '<tr><td>'+element+'</td></tr>';
                    }
                });
                numInBanquet += numInTable;
                htmlTable += '<td rowspan="'+numInTable+'">'+keyTable+'</td>' + htmlAttendee;
            }
            numInMeal += numInBanquet;
            htmlBanquet += '<td rowspan="'+numInBanquet+'">'+keyBanquet+'</td>' + htmlTable;
        }
        htmlDrink += '<tr>'+
                    '<td rowspan="'+numInMeal+'">'+keyMeal+'</td><td rowspan="'+numInMeal+'">'+numInMeal+'</td>' + htmlBanquet;
        chart_array_drink.push([keyMeal, numInMeal]);
    }
    // console.log(htmlMeal);
    // console.log(htmlDrink);
    document.getElementById('table-meal-report').innerHTML = htmlMeal;
    document.getElementById('table-drink-report').innerHTML = htmlDrink;
    // console.log(chart_array_meal);
    drawChart(chart_array_meal, 'chart-meal-inside', 'Total Amount Needed for Each Meal', 'Meal');
    drawChart(chart_array_drink, 'chart-drink-inside', 'Total Amount Needed for Each Drink', 'Drink');
}

function include(arr,obj) {
    var result = (arr.indexOf(obj) != -1);
    return result;
}