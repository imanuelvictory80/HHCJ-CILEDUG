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
        //Create PDF as needed
        doc.save();
    });
}