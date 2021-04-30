var datafiledata = undefined;
var logfiledata  = undefined;
var datatable    = false;
var logtable     = false;
var uploading    = false;

async function UploadFile(type) {
    displayLoader(1);
    uploading = true;
    const startTime = performance.now();
    console.log("uploading file");

    var fileUpload = type == 1 ? document.getElementById("data_file") : document.getElementById("data_log");
    var message = type == 1 ? document.getElementById("filemessage") : document.getElementById("logmessage");

    if(type == 1) {
        datatable = false;
    }
    else {
        logtable = false;
    }
    if(fileUpload.files[0] != undefined) {
        UpdateTabs();     // enables or disables tabs
        await ParseData(type);  //
        doClick(type, 1); // clicks table button --> calls DisplayTable(type, 1, event)
        doClick(type, 2); // clicks graph button --> calls ParseData(type, 2, event)
        message.style.color = "green"; 
        message.innerHTML = "Upload successful!";
    }
    else { 
        uploading = false;
        message.style.color = "red"; 
        message.innerHTML   = "Upload failed!";
        alert("Please upload a valid CSV file.");
        PrintError();
        return;
    }
    
    console.log("finished uploading file")
    console.log("UploadFile took " + (performance.now() - startTime) + " ms");
    uploading = false;
    displayLoader(2);
}

function UpdateTabs() {
    tabletablinks = document.getElementsByClassName("tabletablinks");
    graphtablinks = document.getElementsByClassName("graphtablinks");

    var datafile = document.getElementById("data_file").files[0];
    if(datafile == undefined) {
        tabletablinks[0].className = tabletablinks[0].className.replace(" active", "");
        tabletablinks[0].disabled  = true;
        graphtablinks[0].className = graphtablinks[0].className.replace(" active", "");
        graphtablinks[0].disabled  = true;
    }
    else {
        tabletablinks[0].disabled = false;
        graphtablinks[0].disabled = false;
    }

    var datalog = document.getElementById("data_log").files[0];
    if(datalog == undefined) {
        tabletablinks[1].className =  tabletablinks[0].className.replace(" active", "");
        tabletablinks[1].disabled  = true;
        graphtablinks[1].className =  graphtablinks[0].className.replace(" active", "");
        graphtablinks[1].disabled  = true;
    }
    else {
        tabletablinks[1].disabled = false;
        graphtablinks[1].disabled = false;
    }
}

const waitForPapaParse = async (file) => {
    Papa.parsePromise = function (file) {
        return new Promise(function (complete, error) {
            Papa.parse(file, {
                skipEmptyLines: true,
                fastMode: true,
                complete,
                error
            });
        });
    }

    let results
    await Papa.parsePromise(file)
        .then(function (parsedData) {
            results = parsedData
        });

    return results;
}

async function ParseData(type) {
    const startTime = performance.now();
    console.log("parsing data");
    
	var fileUpload = type == 1 ? document.getElementById("data_file") : document.getElementById("data_log");
    var filepath = fileUpload.files[0];
	if(filepath == undefined || filepath == null) {
        console.log("incorrect");
		alert("Please upload a valid CSV file.");
        return;
	}
	else {
        console.log("starting papaparse");
        var results = await waitForPapaParse(filepath);
        if(type == 1) {
            datafiledata = results.data;
        }
		else if(type == 2) {
            // populateLists(evt, type, results);
            // createGraph(evt, type, results);
            logfiledata = results.data;
        }
        console.log('finished papaparse');
	}

	console.log("finished parsing");
    console.log("ParseData took " + (performance.now() - startTime) + " ms");
}

function DisplayTable(evt, type) {
    displayLoader(1);
    console.log("displaying table");

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
        PrintError();
        return;
    }
    else if(evt == null || evt == undefined) {
        PrintError();
        return;
    }

    var tabletabcontent = type == 1 ? document.getElementById("data_table") : document.getElementById("log_table");
    tabletabcontent.style.display = "table";
    evt.target.className += " active";

    var currenttable = type == 1 ? datatable : logtable;
    if(currenttable == false) {
        CreateTable(evt, type);
    }
    console.log("finished displaying table");
    displayLoader(2);
}

function CreateTable(evt, type) {
    const startTime = performance.now();
    console.log("creating table");

    var table     = document.createElement('table');
    var tableBody = document.createElement('tbody');
    var scroller  = type == 1 ? document.getElementById("data_table_scroller") : document.getElementById("log_table_scroller");
    var data      = type == 1 ? datafiledata : logfiledata;
    data.forEach(function(rowData) {
        var row = document.createElement('tr');
        rowData.forEach(function(cellData) {
            var cell = document.createElement('td');
            cell.appendChild(document.createTextNode(cellData));
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });
    table.appendChild(tableBody);
    scroller.appendChild(table);

    console.log("finished creating table");
    console.log("CreateTable took " + (performance.now() - startTime) + " ms");
    displayLoader(2);
}

function setTableWidth(w) {
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

function populateLists(evt, type) {
	if(evt.isTrusted) {
		return;
	}
	console.log("populating lists");
    var results = type == 1 ? datafiledata : logfiledata;
	var headers = results[0];
	var selects = type == 1 ? document.getElementsByClassName("datalinebox") : document.getElementsByClassName("loglinebox");

	for (var i = 0; i < selects.length; i++) { 
		var select = selects[i];
		for(var j = select.options.length-1; j >= 0; j--) {
			select.remove(j);
		}
	}

	for(var i = 0; i < selects.length; i++) {
		for(var j = 0; j < headers.length; j++) {
			var el = document.createElement("option");
			if(j == 0) {
				el.textContent = "";
				el.value = "null";
			}
			else {
				el.textContent = headers[j];
				el.value = headers[j];
			}

			selects[i].appendChild(el);
		}
	}

	console.log("finished populating lists");
}

function CreateGraph(evt, type) {
	const startTime = performance.now();
	console.log("creating graph");

	populateLists(evt, type);
	var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("graphtabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("graphtablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    
    var dvGRH = type == 1 ? document.getElementById("data_graph") : document.getElementById("log_graph");
	dvGRH.style.display = "contents";
    evt.target.className += " active";

	var data = type == 1 ? datafiledata : logfiledata;
	var lines = type == 1 ? document.getElementsByClassName("datalinebox") : document.getElementsByClassName("loglinebox") ;
	var indices = [];
	for(var i = 0; i < lines.length; i++) {
		indices.push(lines[i].selectedIndex);
	}

	var line1 = [];
	var line2 = [];
	var line3 = [];
	var times = []

	for(var i = 0; i < data.length; i++) {
		line1.push(data[i][indices[0]]);
		line2.push(data[i][indices[1]]);
		line3.push(data[i][indices[2]]);
		if(i > 0) { times.push((parseFloat(data[i][0]) - parseFloat(data[1][0])).toString()); }
		else { times.push(data[i][0]); }
	}

	if(indices[0] == 0) {
		line1 = [];
	}
	if(indices[1] == 0) {
		line2 = [];
	}
	if(indices[2] == 0) {
		line3 = [];
	}

	// console.log(indices);
	// console.log(line1);
	// console.log(line2);
	// console.log(line3);

	console.log("about to generate graph");
	var chart = type == 1 ? document.getElementById("data_chart") : document.getElementById("log_chart");
	c3.generate({
		bindto: chart,
		transition: {
			duration: 0
		},
		padding: {
			bottom: 20
		},
		data: {
			columns: [
				line1,
				line2,
				line3
			]
		},
		axis: {
	        x: {
	            type: 'category',
	            categories: times,
	            tick: {
	            	centered: true,
					multiline: false,
                	culling: {
                    	max: 7
                	},
					fit: false
            	},
				label: {
					text: "Time",
					position: "outer-center"
				},
	        }
	    },
	    zoom: {
        	enabled: true
    	},
	    legend: {
	        position: 'right'
	    }
	});
	console.log("generated graph");

	// doClick(type, 2);
	console.log("finished creating graph");
	const duration = performance.now() - startTime;
    console.log("createGraph took " + duration + " ms");
	displayLoader(2);
}

function PrintError() {
    var currentline = new Error().linenumber;
    console.log("error at line " + currentline);
    displayLoader(2);
    throw new Error("error at line " + currentline);
}