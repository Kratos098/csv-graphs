/*
 * Parse the data and create a graph with the data.
 */

function populateLists(results) {
	var headers = results.data[0];
	var selects = document.getElementsByClassName("linebox");
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

function createGraph(results) {
	var data = results.data;
	var lines = document.getElementsByClassName("linebox");
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
		line3.push(data[i][indices[2]]);
		times.push(data[i][0]);
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

	console.log(line1);
	console.log(line2);
	console.log(line3);

	var char = c3.generate({
		bindto: "#chart",
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
}

function parseData(type, func) {
	let file = type == 1 ? document.getElementById("data_file") : document.getElementById("data_log");
	let filepath = file.files[0];
	Papa.parse(filepath, {
		skipEmptyLines: true,
		download: false,
		complete: function(results) {
			if(func == 1) {
				populateLists(results);
			}
			else {
				createGraph(results)
			}
		}
	});
}