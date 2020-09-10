let map;
let layerControl;

const initmap = () => {
    const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const osmAttrib = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
    const osm = new L.TileLayer(osmUrl, { minZoom: 0, maxZoom: 19, attribution: osmAttrib });

    map = L.map('map', {
        center: [40.412612, -3.686111],
        zoom: 13,
        layers: [osm],
        zoomControl: false
    });
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    const baseMaps = {
        "OSM": osm
    }

    layerControl = L.control.layers(baseMaps).addTo(map);

    downloadData();
    downloadGrid();
};


document.getElementById('submit').addEventListener('click', () => {
    map.removeLayer(observations);
    let init = document.getElementById('start').value;
    let init_date = new Date(init);
    init_date = init_date.toISOString();
    let end = document.getElementById('end').value;
    let end_date = new Date(end);
    /*Added one day to include the end date*/
    end_date.setDate(end_date.getDate() + 1);
    end_date = end_date.toISOString();
    downloadData(init_date, end_date);
});

const downloadData = (init_date, end_date) => {
    let observations_url = `${process.env.BASE_URL}${process.env.API_URL}${process.env.OBSERVATIONS_URL}`;
    if (init_date !== undefined && end_date !== undefined) {
        observations_url = `${observations_url}?init_date=${init_date}&end_date=${end_date}`
    }
    fetch(observations_url)
        .then(handleErrors)
        .then(res => res.json())
        .then(res => drawOutput(res))
        .then(res => removeTable())
        .catch(err => console.log('error', err));
};

const downloadGrid = () => {
    let grid_url = `${process.env.BASE_URL}${process.env.API_URL}${process.env.GRID_URL}`;
    fetch(grid_url)
        .then(handleErrors)
        .then(res => res.json())
        .then(res => drawGrid(res))
        .catch(err => console.log(err));
    
}

const drawOutput = (lines) => {
    const observations = L.geoJson(lines, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, style(feature));
        },
    });
    observations.addTo(map).on('click', observationsTable);
    layerControl.addOverlay(observations, 'Observaciones');
};

var styleGrid = (feature) => {
    return {
        color: getColor(feature.properties.pm2_5),
/*         fillcolor: '#973572',        
 */        weight: 5,
        opacity: 0.65
    }
};

const drawGrid = (lines) => {
    grid = L.geoJson(lines, {
        style: styleGrid
    }).addTo(map).on('click', gridTable);
    /* let gridLayersGroup = L.layerGroup().addLayer(grid).addTo(map); */
    layerControl.addOverlay(grid, 'Rejilla');
}

document.getElementById('loginButton').addEventListener('click', () => {
    let modal = document.getElementById('modalform').style.display = "block";

});

document.querySelector('.btnlogin').addEventListener('click', () => {
    let uname = document.getElementById('uname').value;
    let psw = document.getElementById('psw').value;
    downloadToken(uname, psw);
});

const downloadToken = (user, pass) => {
    let get_token_url = `${process.env.BASE_URL}${process.env.API_URL}${process.env.GET_TOKEN_URL}`;
    let formdata = new FormData();
    formdata.append('username', user);
    formdata.append('password', pass);

    const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
    };

    fetch(get_token_url, requestOptions)
        .then(handleErrors)
        .then(res => res.json())
        .then(res => getToken(res));

}

var token;
const getToken = (res) => {
    token = res.token;
    document.getElementById('uploadfile').style.display = 'inline';
    let modal = document.getElementById('modalform').style.display = 'none';
    removeTable();
}

const handleErrors = (response) => {
    if (!response.ok) throw Error(response.statusText);
    return response;
};

const input = document.getElementById('fileinput');
const onSelectFile = () => {
    console.log(input.files);
    upload(input.files[0])
};
document.getElementById('btnupload').addEventListener('click', onSelectFile, false);

const upload = (file) => {
    const upload_url = `${process.env.BASE_URL}${process.env.API_URL}${process.env.UPLOAD_URL}`;

    const headers = new Headers();
    headers.append('Authorization', `Token ${token}`);

    const formdata = new FormData();
    formdata.append("file", file, file.name);

    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: formdata,
        redirect: 'follow'
    }

    fetch(upload_url, requestOptions)
        .then(handleErrors)
        .then(downloadData)
        .catch(error => console.log('error', error));
}

const getColor = (x) => {
    return  x > 25 ? '#bd0026' :
            x > 20 ? '#e31a1c' :
            x > 15 ? '#fc4e2a' :
            x > 10 ? '#fed976' :
            x >  5 ? '#41ae76' :
                     '#006d2c';
};

const style = (feature) => {
    return {
        radius: 7,
        color: '#ff7800',
        fillColor: getColor(feature.properties.pm2_5),
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
};

const observationsTable = (event) => {
    const date = new Date(event.layer.feature.properties['date_time']);
    const day = getDateFormat(date);
    const hour = getHourFormat(date);

    const clonedProperties = { ...event.layer.feature.properties };
    delete clonedProperties['date_time'];
    clonedProperties['date'] = day;
    clonedProperties['hour'] = hour;
    
    const propertyNames = ['date', 'hour', 'altitude_gps', 'temperature', 'humidity', 'altitude_bar', 'pressure',
            'no2', 'co', 'nh3', 'pm1_0', 'pm2_5', 'pm10_0'];
    const humanNames = {
        'date': 'Fecha',
        'hour': 'Hora',
        'altitude_gps': 'Altitud',
        'temperature': 'Temperatura',
        'humidity': 'Humedad',
        'altitude_bar': 'Altitud Bar',
        'pressure': 'Presión',
        'no2': 'NO2',
        'co': 'CO',
        'nh3': 'NH3',
        'pm1_0': 'PM 1',
        'pm2_5': 'PM 2.5',
        'pm10_0': 'PM 10'
    }
    createTable(clonedProperties, propertyNames, humanNames);
}

const gridTable = (event) => {
    const clonedGridProperties = { ...event.layer.feature.properties };
    const propertyGridNames = ['temperature', 'humidity', 'no2', 'co', 'nh3', 'pm1_0', 'pm2_5', 'pm10_0'];
    const humanGridNames = {
        'temperature': 'Temperatura',
        'humidity': 'Humedad',
        'no2': 'NO2',
        'co': 'C0',
        'nh3': 'NH3',
        'pm1_0': 'PM 1',
        'pm2_5': 'PM 2.5',
        'pm10_0': 'PM 10'
    }
    createTable(clonedGridProperties, propertyGridNames, humanGridNames);
}

const createTable = (clonedProperties, propertyNames, humanNames) => {
    document.getElementById('openSidebarMenu').checked = true;
    body = document.getElementById('datepicker');    
    removeTable();    

    let table = document.createElement('table');
    table.setAttribute('id', 'table');
    table.setAttribute('class', 'observation_table');
    let tblBody = document.createElement('tbody');

    propertyNames.map(property => {
        let fila = document.createElement('tr');
        let celda1 = document.createElement('td');
        celda1.style.color = 'white';
        let celda2 = document.createElement('td');
        celda2.style.color = 'white';
        let contenidoCelda1 = document.createTextNode(humanNames[property]);
        let contenidoCelda2 = document.createTextNode(clonedProperties[property]);
        celda1.appendChild(contenidoCelda1);
        celda2.appendChild(contenidoCelda2);
        fila.appendChild(celda1);
        fila.appendChild(celda2);
        tblBody.appendChild(fila);
    })

    table.appendChild(tblBody);
    body.appendChild(table);
    table.setAttribute('border', '2');
}

const removeTable = () => {
    let element = document.getElementById('table');
    if (typeof (element) != 'undefined' && element != null) {
        let parentEl = element.parentElement;
        parentEl.removeChild(element);
    }
}

const getDateFormat = (date) => {
    let pad = '00';
    let d = date.getDate().toString();
    d = pad.substr(0, pad.length - d.length) + d;
    let m = date.getMonth() + 1;
    m = m.toString();
    m = pad.substr(0, pad.length - m.length) + m;
    day = [d, m, date.getFullYear()].join('/');
    return day;
}

const getHourFormat = (date) => {
    let h = date.getHours().toString();
    let m = date.getMinutes().toString();
    let s = date.getSeconds().toString();
    let pad = '00';
    h = pad.substr(0, pad.length - h.length) + h;
    m = pad.substr(0, pad.length - m.length) + m;
    s = pad.substr(0, pad.length - s.length) + s;
    let hour = [h, m, s].join(':');
    return hour;
}

initmap();
