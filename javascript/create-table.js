function UploadFile(type) {
    const startTime = performance.now();
    console.log("uploading file");
    var fileUpload = type == 1 ? document.getElementById("data_file") : document.getElementById("data_log");
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
        displayLoader(1);
        UpdateTabs();
        doClick(type, 1);
        doClick(type, 2);
    } 
    else {
        alert("Please upload a valid CSV file.");
    }
    console.log("finished uploading file")
    const duration = performance.now() - startTime;
    console.log("UploadFile took " + duration + " ms");
    var message = type == 1 ? document.getElementById("filemessage") : document.getElementById("logmessage");
    message.innerHTML = "Upload successful!";
}

function UpdateTabs() {
    tabletablinks = document.getElementsByClassName("tabletablinks");
    graphtablinks = document.getElementsByClassName("graphtablinks");

    var datafile = document.getElementById("data_file").files[0];
    if(datafile == undefined) {
        tabletablinks[0].className =  tabletablinks[0].className.replace(" active", "");
        tabletablinks[0].disabled = true;
        graphtablinks[0].className =  graphtablinks[0].className.replace(" active", "");
        graphtablinks[0].disabled = true;
    }
    else {
        tabletablinks[0].disabled = false;
        graphtablinks[0].disabled = false;
    }

    var datalog = document.getElementById("data_log").files[0];
    if(datalog == undefined) {
        tabletablinks[1].className =  tabletablinks[0].className.replace(" active", "");
        tabletablinks[1].className += " disabled";
        graphtablinks[1].className =  graphtablinks[0].className.replace(" active", "");
        graphtablinks[1].className += " disabled";
    }
    else {
        tabletablinks[1].disabled = false;
        graphtablinks[1].disabled = false;
    }
}

function setWidth(w) {
    var tables = document.getElementById("tables");
    var tableborder = document.getElementById("tableborder");
    var vwWidth = w * (100 / document.documentElement.clientWidth);
    var vwWidthStr = vwWidth.toString() + "vw";
    if(vwWidth < 93) {
        tables.style.width = vwWidthStr;
        tableborder.style.width = vwWidthStr;
        console.log("set new width");
    }
    else {
        tables.style.width = "93vw";
        tableborder.style.width = "93vw";
        console.log("did not set new width");
    }
}

function CreateTable(evt, type) {
    const startTime = performance.now();
    var loader = document.getElementById("loading");
    var loading = false;
    if(loader.style.display == "none") {
        displayLoader(1);
        loading = true;
    }
    console.log("creating table");
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabletabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tabletablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    
    var fileUpload = type == 1 ? document.getElementById("data_file") : document.getElementById("data_log");
    if(fileUpload.value == "") {
        alert("Please upload a file!")
        if(loading) {displayLoader(2);}
        return;
    }
    else if(evt == null || evt == undefined) {
        if(loading) {displayLoader(2);}
        return;
    }

    var tabletabcontent = type == 1 ? document.getElementById("data_table") : document.getElementById("log_table");
    tabletabcontent.style.display = "table";
    evt.target.className += " active";
    if (typeof(FileReader) != "undefined") {
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
            }
            var scroller = type == 1 ? document.getElementById("data_table_scroller") : document.getElementById("log_table_scroller");
            scroller.innerHTML = "";
            scroller.appendChild(table);
            setWidth(table.clientWidth);
        }
        reader.readAsText(fileUpload.files[0]);
    } 
    else {
        alert("This browser does not support HTML5.");
        return;
    }
    console.log("finished creating table");
    if(loading) {displayLoader(2);}
    const duration = performance.now() - startTime;
    console.log("CreateTable took " + duration + " ms");
}