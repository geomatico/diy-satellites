var map;

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

    downloadData();
}


function downloadData() {

    BASE_URL = 'http://0.0.0.0:8000/'
    API_URL = 'api/v1/'
    URL = 'observations/'

    init_date = "2020-06-16T00:00:00Z"
    end_date = "2020-06-18T00:00:10Z"
    const get_url = `${BASE_URL}${API_URL}${URL}?init_date=${init_date}&end_date=${end_date}`

    fetch(get_url)
        .then(handleErrors)
        .then(res => res.json())
        .then(res => drawOutput(res))
        .catch(err => console.log(err));
}
function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
    }

    
function drawOutput(lines) {
/*     var lineCoordinate = [];
    for (let i in lines.features) {
        var pointJson = lines.features[i];
        let coord = pointJson.geometry.coordinates;
        lineCoordinate.push([coord[1], coord[0]]);
    }
    L.polyline(lineCoordinate, { style: style }).addTo(map); */


    L.geoJson(lines, { 
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, style(feature));
        },
        onEachFeature: popupTemperature
    }).addTo(map);
    }

function getColor(x) {
    return x > 7 ? '#c51b8a' :
           x > 4 ? '#fde0dd' :
           x > 1 ? '#31a534' :
                   '#756bb1';
}

function style(feature) {
    return {
        radius: 8,
        color: '#ff7800',
        fillColor: getColor(feature.properties.temperature),
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
}

function popupTemperature(feature, layer) {
    if (feature.properties && feature.properties.temperature) {
        layer.bindPopup("<div><h3>"+feature.properties.temperature+"</div>")
    }
}