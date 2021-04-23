function populateLists(evt, type, results) {
	// console.log(evt);
	if(evt.isTrusted) {
		return;
	}
	console.log("populating lists");
	var headers = results.data[0];
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

function createGraph(type, results) {
	const startTime = performance.now();
	console.log("creating graph");
	var data = results.data;
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

function parseData(type, func, evt) {
	const startTime = performance.now();
	console.log("parsing data");
	var loader = document.getElementById("loading");
    var loading = false;
    if(loader.style.display == "none") {
        displayLoader(1);
        loading = true;
    }
	var fileUpload = type == 1 ? document.getElementById("data_file") : document.getElementById("data_log");
	var filepath = fileUpload.files[0];
    if(fileUpload.value == "") {
        alert("Please upload a file!")
		if(loading) {displayLoader(2);}
        return;
	} 

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

	if(filepath == undefined || filepath == null) {
		alert("Please upload a valid CSV file.");
		if(loading) {displayLoader(2);}
	}
	else {
		Papa.parse(filepath, {
			skipEmptyLines: true,
			download: false,
			complete: function(results) {
				// if(func == 1) {
					populateLists(evt, type, results);
					createGraph(type, results);
					console.log("papaparse done");
					// displayLoader(2);
				// }
			}
		});
	}

	console.log("finished parsing");
	const duration = performance.now() - startTime;
    console.log("parseData took " + duration + " ms");
}