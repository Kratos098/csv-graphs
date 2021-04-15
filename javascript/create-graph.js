function populateLists(type, results) {
	console.log("populating lists");
	var headers = results.data[0];
	var selects = type == 1 ? document.getElementsByClassName("lineboxD") : document.getElementsByClassName("lineboxL");

	for (var i = 0; i < selects.length; i++) {
		var select = selects[i]
		for (i = 0; i < select.options.length; i++) {
			select.options[i] = null;
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
}

function createGraph(type, results) {
	var data = results.data;
	var lines = type == 1 ? document.getElementsByClassName("lineboxD") : document.getElementsByClassName("lineboxL") ;
	var indices = [];
	for(var i = 0; i < lines.length; i++) {
		indices.push(lines[i].selectedIndex);
	}

	var line1 = [];
	var line2 = [];
	var line3 = [];
	var times = []

	for(var i = 0; i < data.length; i++) {
		line1.push(data[i][indices[0]] );
		line2.push(data[i][indices[1]]);
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

	var chart = type == 1 ? document.getElementById("data_chart") : document.getElementById("log_chart");
	c3.generate({
		bindto: chart,
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
                    	max: 5
                	},
					fit: true
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

	// doClick(type, 2);
}

function parseData(type, func, evt) {
	var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontentG");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinksG");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    
    var fileUpload = type == 1 ? document.getElementById("data_file") : document.getElementById("data_log");
    if(fileUpload.value == "") {
        alert("Please upload a file!")
        return;
    }

    var dvGRH = type == 1 ? document.getElementById("data_graph") : document.getElementById("log_graph");
	dvGRH.style.display = "contents";
    evt.target.className += " active";

	let file = type == 1 ? document.getElementById("data_file") : document.getElementById("data_log");
	let filepath = file.files[0];
	console.log(filepath);
	console.log(type, func);
	if(filepath == undefined || filepath == null) {
		alert("Please upload a valid CSV file.");
	}
	else {
		Papa.parse(filepath, {
			skipEmptyLines: true,
			download: false,
			complete: function(results) {
				if(func == 1) {
					populateLists(type, results);
				}
				else {
					createGraph(type, results)
				}
			}
		});
	}
}