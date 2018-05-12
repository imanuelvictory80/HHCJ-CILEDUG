google.charts.load('current', {packages: ['corechart', 'bar']});
// google.charts.setOnLoadCallback(drawBasic);

function drawBasic() {
    //Check for checkboxes
    var selchbox = [];        // array that will store the value of selected checkboxes
    var inpfields = document.getElementsByTagName('input');
    var nr_inpfields = inpfields.length;

    // traverse the inpfields elements, and adds the value of selected (checked) checkbox in selchbox
    for(var i=0; i<nr_inpfields; i++) {
        if(inpfields[i].type == 'checkbox' && inpfields[i].checked == true) selchbox.push(inpfields[i].value);
    }
    
    //Read data from the database
    var dataARR = new Array(100);
    for (var i = 0; i < 100; i++) {
        dataARR[i] = 0;
    }
    var database = firebase.database();
    var attendee = database.ref('users').orderByKey();
    attendee.on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var val = childSnapshot.val();
            var meal = parseInt(val["meal"]);
            dataARR[meal] += 1;
        });
        drawChart(dataARR, 'chart_div', 'Summary of All Banquet', 'Meal');
    });
}

function drawChart(data_array, htmlID, chartName, mealOrDrink) {
    // var data = new google.visualization.DataTable();
    // data.addColumn('string', mealOrDrink);
    // data.addColumn('number', "Number of Orders");
    // data.addRows(4);
    // for (var i = 0; i < 4; i++) {
    //     for (var j = 0; j < 2; j++) {
    //         if (j == 0) {
    //             var tmp = mealOrDrink + " " + (i+1);
    //         }
    //         else {
    //             var tmp = data_array[i];
    //         }
    //         data.setCell(i, j, tmp); 
    //     }
    // }
    var data = google.visualization.arrayToDataTable(data_array);
    var options = {
        title: chartName,
        chartArea: {width: '50%'},
        hAxis: {
          title: 'Number of Orders',
          minValue: 0
        },
        vAxis: {
          title: 'Meal'
        },
        is3D: true,
        backgroundColor: '#E4E4E4'
    };
    var chart = new google.visualization.BarChart(document.getElementById(htmlID));
    chart.draw(data, options);
}