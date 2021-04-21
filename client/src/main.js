import DiyConstants from './constants'
import css from './style.css'
let map;
let layerControl;
let observations;
let grid;

const initmap = () => {
    const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const geomaticoUrl = 'https://tileserver.geomatico.es/styles/klokantech-basic/{z}/{x}/{y}.png';
    const osmAttrib = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
    const osm = new L.TileLayer(osmUrl, { minZoom: 0, maxZoom: 19, attribution: osmAttrib });
    const geomatico = new L.TileLayer(geomaticoUrl, { minZoom: 0, maxZoom: 19, attribution: osmAttrib });

    map = L.map('map', {
        center: [40.412612, -3.686111],
        zoom: 13,
        layers: [geomatico],
        zoomControl: false
    });
    L.control.zoom({
        position: 'topleft'
    }).addTo(map);

    const baseMaps = {
        "Basic": geomatico,
        "OSM": osm
    }

    layerControl = L.control.layers(null, baseMaps, {position: 'topleft'}).addTo(map);
    downloadGrid();    
    createLegend();
};

const createLegend = () => {
    let legend = L.control({position: 'bottomleft'});
    legend.onAdd = (map) => {
        const div = L.DomUtil.create('div', 'leg')
        const grades = [0, 5, 10, 15, 20, 25]
        const labels = [];
        div.innerHTML = `PM2.5 ${DiyConstants.UNITS} ${DiyConstants.BREAKLINE} `
        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + (grades[i + 1]- 1) + '<br>' : '+');
        } 
        return div; 
    };
    legend.addTo(map);
}

document.getElementById('submit').addEventListener('click', () => {
    map.removeLayer(observations);
    map.removeLayer(grid);
    removeTable();
    let init = document.getElementById('start').value;
    let init_date = new Date(init);
    init_date = init_date.toISOString();
    let end = document.getElementById('end').value;
    let end_date = new Date(end);
    /*Added one day to include the end date*/
    end_date.setDate(end_date.getDate() + 1);
    end_date = end_date.toISOString();
    hideSidebar();
    downloadData(init_date, end_date);
});

$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
  });

document.querySelector('.custom-file-input').addEventListener('change', (e) => {
    let filename = document.getElementById('inputFile').files[0].name;
    let nextSibling = e.target.nextElementSibling;
    nextSibling.innerText = filename;
});
  
const downloadData = (init_date, end_date) => {
    let observations_url = `${process.env.BASE_URL}${process.env.API_URL}observations/`;
    if (init_date !== undefined && end_date !== undefined) {
        observations_url = `${observations_url}?init_date=${init_date}&end_date=${end_date}`
    }
    fetch(observations_url)
        .then(res => handleErrors(res))
        .then(res => res.json())
        .then(res => drawOutput(res))
        .then(() => removeTable())
        .catch(err => showAlert('No existen observaciones en las fechas solicitadas'));
};

const downloadGrid = () => {
    const grid_url = `${process.env.BASE_URL}${process.env.API_URL}grid/`;
    fetch(grid_url)
        .then(res => handleErrors(res))
        .then(res => res.json())
        .then(res => drawGrid(res))
        .catch(err => console.log(err));
}

const drawOutput = (lines) => {
        observations = L.geoJson(lines, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, style(feature));
            },
        });
        if (lines.features.length == 0) {
            throw console.error();
        } else {
        observations.addTo(map).on('click', observationsTable);
        layerControl.removeLayer(observations);
        layerControl.addOverlay(observations, 'Observaciones');
        let end_observation = lines.features.length - 1;
        map.flyTo([lines.features[end_observation].geometry.coordinates[1], lines.features[end_observation].geometry.coordinates[0]], 
            16, {animate: false, duration: 0.1});
        return true;
    }
};

var styleGrid = (feature) => {
    return {
        color: 'black',
        weight: 2,
        fillOpacity: 0.65,
        fillColor: getColor(feature.properties.pm2_5)
    }
};

const drawGrid = (lines) => {
    grid = L.geoJson(lines, {
        style: styleGrid
    }).addTo(map).on('click', gridTable);
    layerControl.removeLayer(grid);
    layerControl.addOverlay(grid, 'Rejilla');
    downloadData();
}

document.getElementById('loginButton').addEventListener('click', () => {
    const modal = document.getElementById('modalform').style.display = "block";

});

document.getElementById('btnlogin').addEventListener('click', () => {
    const uname = document.getElementById('uname').value;
    const psw = document.getElementById('psw').value;
    $("#modalform").modal("hide");
    $(".navbar-toggler").click();
    downloadToken(uname, psw);
});

const downloadToken = (user, pass) => {
    const get_token_url = `${process.env.BASE_URL}${process.env.API_URL}api-token-auth/`;
    let formdata = new FormData();
    formdata.append('username', user);
    formdata.append('password', pass);

    const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
    };

    fetch(get_token_url, requestOptions)
        .then(res => handleErrors(res))
        .then(res => res.json())
        .then(res => getToken(res))
        .catch(res => {
            showAlert('Usuario no registrado');
            document.getElementById('uname').value = '';
            document.getElementById('psw').value = '';
        });
}

var token;
const getToken = (res) => {
    token = res.token;
    showSidebar();
    document.getElementById('uploadfile').style.display = 'inline';
    removeTable();
}

const handleErrors = (response) => {
    if (!response.ok) throw Error(response);
    return response;
};

const input = document.getElementById('inputFile');
const onSelectFile = () => {
    upload(input.files[0])
};

document.getElementById('btnupload').addEventListener('click', onSelectFile, false);

const upload = (file) => {
    const upload_url = `${process.env.BASE_URL}${process.env.API_URL}upload/`;

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
        .then(res => handleErrors(res))
        .then(res => {
            downloadGrid();
            downloadData();
            hideSidebar();
        })
        .catch(res => {
            hideSidebar();
            showAlert('CSV mal formado')});
}

const getColor = (x) => {
    return  x > 25 ? '#bd0026' :
            x > 19 ? '#e31a1c' :
            x > 14 ? '#fc4e2a' :
            x >  9 ? '#fed976' :
            x >  5 ? '#41ae76' :
                     '#006d2c';
};

const style = (feature) => {
    return {
        radius: 7,
        color: 'black',
        fillColor: getColor(feature.properties.pm2_5),
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.8
    };
};

const observationsTable = (event) => {
    const date = new Date(event.layer.feature.properties['date']);
    const day = getDateFormat(date);
    const clonedProperties = { ...event.layer.feature.properties };
    clonedProperties['date'] = day;
    
    const propertyNames = ['date', 'time', 'pm1_0', 'pm2_5', 'pm10_0'];
    const humanNames = {
        'date': 'Fecha',
        'time': 'Hora',
        'pm1_0': `PM 1 ${DiyConstants.UNITS}`,  
        'pm2_5': `PM 2.5 ${DiyConstants.UNITS}`,
        'pm10_0': `PM 10 ${DiyConstants.UNITS}`
    }
    createTable(clonedProperties, propertyNames, humanNames);
}

const gridTable = (event) => {
    const clonedGridProperties = { ...event.layer.feature.properties };
    const propertyGridNames = ['username', 'pm1_0', 'pm2_5', 'pm10_0'];
    const humanGridNames = {
        'username': 'Usuario + activo',
        'pm1_0': `PM 1 ${DiyConstants.UNITS}`,
        'pm2_5': `PM 2.5 ${DiyConstants.UNITS}`,
        'pm10_0': `PM 10 ${DiyConstants.UNITS}`        
    }
    createTable(clonedGridProperties, propertyGridNames, humanGridNames);
}

const hideSidebar = () => {
    const sideBar = document.getElementById('sidebar-wrapper').offsetLeft;
    if ((window.screen.width <= 420) & (sideBar > 0)) {
        $("#wrapper").toggleClass("toggled");
    }
}

const showSidebar = () => {
    const sideBar = document.getElementById('sidebar-wrapper').offsetLeft;
    if (sideBar < 0) {
        $("#wrapper").toggleClass("toggled");
    }
}

const createTable = (clonedProperties, propertyNames, humanNames) => {
    showSidebar();
    const body = document.getElementById('datepicker');    
    removeTable();    

    let table = document.createElement('table');
    table.setAttribute('id', 'table');
    table.setAttribute('class', 'observation_table');
    table.setAttribute('border', '1');
    table.setAttribute('border-color', 'black');
    let tblBody = document.createElement('tbody');

    propertyNames.map(property => {
        let fila = document.createElement('tr');
        let celda1 = document.createElement('td');
        celda1.style.color = 'black';
        let celda2 = document.createElement('td');
        celda2.style.color = 'black';
        let contenidoCelda1 = document.createTextNode(humanNames[property]);
        let contenidoCelda2;
        contenidoCelda2 = document.createTextNode(clonedProperties[property]);
        celda1.appendChild(contenidoCelda1);
        celda2.appendChild(contenidoCelda2);
        fila.appendChild(celda1);
        fila.appendChild(celda2);
        tblBody.appendChild(fila);
    })

    table.appendChild(tblBody);
    body.appendChild(table);
    
}

const removeTable = () => {
    const element = document.getElementById('table');
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
    const day = [d, m, date.getFullYear()].join('/');
    return day;
}

const showAlert = (message) => {
    $('#alert p').text(message);
    $('#alert').fadeTo(1000, 500).slideUp(500, function() {
        $('#alert').slideUp(500);
    })
}

document.getElementById('close').addEventListener('click', () => {
    $('#alert p').text('');
    $('#alert').hide();
})

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
