function Upload() {
    var fileUpload = document.getElementById("data_file");
    document.getEleme
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
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
                    //console.log(i);
                    // updateProgress(i, rows.length);
                }
                // updateProgress(0, rows.length);
                var dvCSV = document.getElementById("table");
                dvCSV.innerHTML = "";
                dvCSV.appendChild(table);
            }
            
            reader.readAsText(fileUpload.files[0]);
        } else {
            alert("This browser does not support HTML5.");
        }
    } else {
        alert("Please upload a valid CSV file.");
    }
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