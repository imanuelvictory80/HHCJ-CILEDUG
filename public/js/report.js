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

    // traverse the inpfields elements, and adds the value of selected (checked) checkbox in selchbox
    for(var i=0; i<nr_inpfields; i++) {
        if(inpfields[i].type == 'checkbox' && inpfields[i].checked == true) selchbox.push(inpfields[i].value);
    }
    
    //Read data from the database
    var dataARR = new Array(100);
    for (i = 0; i < 100; i++) {
        dataARR = new Array(100);
    }
    var ycount = 20;
    var database = firebase.database();
    for (i = 0; i < selchbox.length; i++) {
        var attendee = database.ref('banquet/' + selchbox[i].toString() + '/attendees');
        attendee.forEach(function(snapshot) {
            var table = snapshot.val().table;
            var meal = snapshot.val().meal;
            dataARR[table][meal] += 1;
        });
        doc.text(10, ycount, "For banquet " + selchbox[i].toString()); ycount += 5;
        for (j = 0; j < 100; j++) {
            for (k = 0; k < 100; k++)
                if (dataARR[j][k] > 0) {
                    doc.text(10, ycount, "For table " + j.toString() + " ," + dataARR[j][k].toString() + " meal " + k.toString() + " is ordered.");
                    ycount +=5 ;
                }
                
        }
    }
    
    //Create PDF as needed
    doc.save();
}