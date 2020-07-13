var map;
var heat = null;
var heatLayers = [];
var osm = null;
var debug;
var slider = document.getElementById("myRange");


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
function loadCsvData(CsvData) {

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


function processData(csv) {
    
    BASE_URL = 'http://0.0.0.0:8000/'
    API_URL = 'api/v1/'
    URL = 'observations/'

    init_date = "2020-06-16T00:00:00Z"
    end_date = "2020-06-16T00:00:10Z"
    const get_url = `${BASE_URL}${API_URL}${URL}?init_date=${init_date}&end_date=${end_date}`

    var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};
    
    fetch(get_url)
        .then(res => res.json())
        .then(res => drawOutput(res))
        .catch(function(err){})


    


function drawOutput(lines) {
    var lineCoordinate = [];
    for(let i in lines.features){
        var pointJson = lines.features[i];
        let coord = pointJson.geometry.coordinates;
        //L.marker([coord[1],coord[0]]).addTo(map);
        lineCoordinate.push([coord[1],coord[0]]);

    }
    L.polyline(lineCoordinate, {color: 'red'}).addTo(map);
    map.fitBounds(polyline.getBounds());
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
}}