var map;
var heat = null;
var heatLayers = [];
var osm = null;
var debug;
var slider = document.getElementById("myRange");

slider.oninput = function () {
    if (heatLayers.length > 0) {
        console.log(slider.value);
        for (var i = 0; i < heatLayers.length; i++) {
            if (heatLayers[i]._map !== null)
                heatLayers[i].setOptions({ radius: parseInt(slider.value) });
        }
    }
}

function initmap() {
    // create the tile layer with correct attribution
    var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
    osm = new L.TileLayer(osmUrl, { minZoom: 0, maxZoom: 19, attribution: osmAttrib });

    map = L.map('map', {
        center: [40.412612, -3.686111],
        zoom: 13,
        layers: [osm]
    });

    processData("");
}
function loadCsvData(CsvData) {// asumes: labels in fist line and directly data in the folowing lines. first colum must be latitude, longitude!(in that order)
    /*Example content of .csv
    CsvData = [
        ["latitude", "longitude", "time", "temp"​, "hum", "alt", "PM2.5", "CO2", "CO", "NO2", "NH3"],
        ["40.4106902","-3.6938668","17:48:44.00","24","40","634","80","13","0","10","4"]
        .
    ]*/

    /*After Parsing:
    data = {
        "time": [ [lat,long,time],[lat,long,time],... ],
        "hum" : [ [lat,long, hum],[lat,long, hum],... ],
        .
    }
    use: data.time
    */

    //first, we have to make sure what is the "real" size of CsvData, for Example empty lines at the end will cause NaN entries(the "" will get transformed by parseFloat() to a NaN) and produce errors
    var CsvDataLength = CsvData.length;
    for (let i = CsvData.length - 1; i >= 0; i--) {
        if (CsvData[i][0] != [""]) {
            CsvDataLength = i + 1;
            break;
        }
    }
    //now we populate data object
    //first for goes through the first line (time, temp, hum....)(not lat/lond) and the next for goes the corresponding column down (aka. the corresponding data)
    data = {};
    for (let i = 2; i < CsvData[0].length; i++) {
        data[CsvData[0][i].replace(/\s+/g, '')] = [];// add a new entry into the object (and spaces removed )
        for (let j = 1; j < CsvDataLength; j++) {
            data[CsvData[0][i].replace(/\s+/g, '')].push([parseFloat(CsvData[j][0]), parseFloat(CsvData[j][1]), parseFloat(CsvData[j][i])]);

        }
    }

    //normalice data
    for (var item in data) {
        var max = 0;
        var min = 10000000;
        for (let i = 0; i < data[item].length; i++) {//find max value in data series
            if (data[item][i][2] > max)
                max = data[item][i][2];
            if (data[item][i][2] < min)
                min = data[item][i][2];
        }
        for (let i = 0; i < data[item].length; i++) {//divide every value by max
            data[item][i][2] = (data[item][i][2] - min) / (max - min);
        }
    }
    var overlayMaps = {};
    for (var item in data) {
        heatLayers.push(L.heatLayer(data[item], { radius: 25, name: item }).addTo(map));
        if (heatLayers.length - 1 != 5)
            map.removeLayer(heatLayers[heatLayers.length - 1]);
        overlayMaps[item] = heatLayers[heatLayers.length - 1];
    }
    debug = overlayMaps;
    L.control.layers(null, overlayMaps, { collapsed: false }).addTo(map);
    map.flyTo(L.latLng(parseFloat(CsvData[5][0]), parseFloat(CsvData[5][1])), 18);
}


//////////////////////////////////////////////////////
// https://github.com/MounirMesselmeni/html-fileapi // modified
function handleFiles(files) {
    // Check for the various File API support.
    if (window.FileReader) {
        // FileReader are supported.
        // Handle errors load
        var reader = new FileReader();
        reader.onload = loadHandler;
        reader.onerror = errorHandler;
        // Read file into memory as UTF-8      
        reader.readAsText(files[0]);
    } else {
        alert('FileReader are not supported in this browser.');
    }
}

function loadHandler(event) {
    var csv = event.target.result;
    console.log(csv);
    processData(csv);
}

function processData(csv) {
    
    BASE_URL = 'http://0.0.0.0:8000/'
    API_URL = 'api/v1/'
    URL = 'observations/'

    init_date = "2020-06-16T00:00:00Z"
    end_date = "2020-06-16T00:00:10Z"
    const get_url = `${BASE_URL}${API_URL}${URL}?init_date=${init_date}&end_date=${end_date}`
    fetch(get_url)
        .then(function(response) {
            console.log(response);
        });
    
    csv = csv_data;//////////////////////////////////
    var allTextLines = csv.split(/\r\n|\n/);
    var lines = [];
    while (allTextLines.length) {
        lines.push(allTextLines.shift().split(','));
    }
    //console.log(lines);
    loadCsvData(lines);//
    //drawOutput(lines);
}

//if your csv file contains the column names as the first line
function processDataAsObj(csv) {
    var allTextLines = csv.split(/\r\n|\n/);
    var lines = [];

    //first line of csv
    var keys = allTextLines.shift().split(',');

    while (allTextLines.length) {
        var arr = allTextLines.shift().split(',');
        var obj = {};
        for (var i = 0; i < keys.length; i++) {
            obj[keys[i]] = arr[i];
        }
        lines.push(obj);
    }
    console.log(lines);
    drawOutputAsObj(lines);
}

function errorHandler(evt) {
    if (evt.target.error.name == "NotReadableError") {
        alert("Canno't read file !");
    }
}

function drawOutput(lines) {
    //Clear previous data
    document.getElementById("output").innerHTML = "";
    var table = document.createElement("table");
    for (var i = 0; i < lines.length; i++) {
        var row = table.insertRow(-1);
        for (var j = 0; j < lines[i].length; j++) {
            var firstNameCell = row.insertCell(-1);
            firstNameCell.appendChild(document.createTextNode(lines[i][j]));
        }
    }
    document.getElementById("output").appendChild(table);
}

//draw the table, if first line contains heading
function drawOutputAsObj(lines) {
    //Clear previous data
    document.getElementById("output").innerHTML = "";
    var table = document.createElement("table");

    //for the table headings
    var tableHeader = table.insertRow(-1);
    Object.keys(lines[0]).forEach(function (key) {
        var el = document.createElement("TH");
        el.innerHTML = key;
        tableHeader.appendChild(el);
    });

    //the data
    for (var i = 0; i < lines.length; i++) {
        var row = table.insertRow(-1);
        Object.keys(lines[0]).forEach(function (key) {
            var data = row.insertCell(-1);
            data.appendChild(document.createTextNode(lines[i][key]));
        });
    }
    document.getElementById("output").appendChild(table);
}