function UploadFile(type) {
    var fileUpload = type == 1 ? document.getElementById("data_file") : document.getElementById("data_log");
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
        CreateTable(null, type);
        doClick(type);
    } 
    else {
        alert("Please upload a valid CSV file.");
    }
}

function CreateTable(evt, type) {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    
    var fileUpload = type == 1 ? document.getElementById("data_file") : document.getElementById("data_log");
    if(fileUpload.value == "") {
        alert("Please upload a file!")
        return;
    }
    else if(evt == null || evt == undefined) {
        return;
    }

    var dvTBL = type == 1 ? document.getElementById("data_table") : document.getElementById("log_table");
    dvTBL.style.display = "table";
    evt.target.className += " active";
    if (typeof (FileReader) != "undefined") {
        var reader = new FileReader();
        reader.onload = function (e) {
            var table = document.createElement("table");
            var rows = e.target.result.split("\n");
            for (var i = 0; i < rows.length; i++) {
                var cells = rows[i].split(",");
                if (cells.length > 1) {
                    var row = table.insertRow(-1);
                    for (var j = 0; j < cells.length; j++) {
                        var cell = row.insertCell(-1);
                        cell.innerHTML = cells[j];
                    }
                }
                // console.log(i);
                // updateProgress(i, rows.length);
            }
            // updateProgress(0, rows.length);
            var dvCSV = type == 1 ? document.getElementById("data_table_scroller") : document.getElementById("log_table_scroller");
            dvCSV.innerHTML = "";
            dvCSV.appendChild(table);
        }
        reader.readAsText(fileUpload.files[0]);
    } 
    else {
        alert("This browser does not support HTML5.");
        return;
    }

    doClick(type);
}

// function updateProgress(row, length) {
//     var width = Math.round((row*100)/length);
//     //console.log(width);
//     var elem = document.getElementById("bar");
//     elem.setAttribute("style", "width: "+ width + "%");
//     // console.log(elem.style.width);
//     if(width == 0) {
//         console.log(elem.style.width);
//     }
// }