let map;

const initmap = () => {
    var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
    osm = new L.TileLayer(osmUrl, { minZoom: 0, maxZoom: 19, attribution: osmAttrib });

    map = L.map('map', {
        center: [40.412612, -3.686111],
        zoom: 13,
        layers: [osm],
        zoomControl: false
    });

    L.control.zoom({
        position: 'topright'
    }).addTo(map);

    downloadData();
};


document.getElementById('submit').addEventListener('click', ()=>{
    map.removeLayer(marker);
    let init = document.getElementById('start').value;
    let init_date = new Date(init);
    init_date = init_date.toISOString();
    let end = document.getElementById('end').value;
    let end_date = new Date(end);
    /*Add one day because server SQL end_range add time 00:00:00*/
    end_date.setDate(end_date.getDate() + 1);
    end_date = end_date.toISOString();
    downloadData(init_date, end_date);
});

const downloadData = (init_date, end_date) => {    
    let observations_url = `${process.env.BASE_URL}${process.env.API_URL}${process.env.OBSERVATIONS_URL}`;
    if (init_date !== undefined && end_date !== undefined){
        observations_url = `${observations_url}?init_date=${init_date}&end_date=${end_date}`
    }
    fetch(observations_url)
        .then(handleErrors)
        .then(res => res.json())
        .then(res => drawOutput(res))
        .catch(err => console.log(err));
};

var marker;
const drawOutput = (lines) => {
    marker = L.geoJson(lines, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, style(feature));
        },
    }).addTo(map).on('click', createTable);
};

document.getElementById('loginButton').addEventListener('click',()=>{
    let modal =document.getElementById('modalform').style.display ="block";
    
});

document.querySelector('.btnlogin').addEventListener('click',()=>{
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
    let modal =document.getElementById('modalform').style.display = 'none';
}

const handleErrors = (response) => {
    if (!response.ok) throw Error(response.statusText);
    return response;
};

const input = document.getElementById('btnupload');
const onSelectFile = () => upload(input.files[0]);
input.addEventListener('click', onSelectFile, false);

const upload = (file) => {
    const upload_url = `${process.env.BASE_URL}${process.env.API_URL}${process.env.UPLOAD_URL}`;

    const headers = new Headers();
    headers.append('Authorization', token);

    const formdata = new FormData();
    formdata.append("file", file, file.name);

    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: formdata,
        redirect: 'follow'
    }
    
    fetch(upload_url, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
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

const createTable = (event) => {
    document.getElementById('openSidebarMenu').checked = true;
    body = document.getElementById('datepicker');
    let element = document.getElementById('table');
    if (typeof (element) != 'undefined' && element != null) {
        let parentEl = element.parentElement;
        parentEl.removeChild(element);
    }

    let table = document.createElement('table');
    table.setAttribute('id', 'table');
    table.setAttribute('class', 'observation_table');
    /*table.style.borderColor = '#5E063D';*/
    let tblBody = document.createElement('tbody');

    for (let index in event.layer.feature.properties) {
        let row = document.createElement('tr');
        let cell1 = document.createElement('td');
        cell1.style.color = 'white';
        let cell2 = document.createElement('td');
        cell2.style.color = 'white';
        if (index == 'date_time') {
            let date = new Date(event.layer.feature.properties[index]);
            dateFormat = getDateFormat(date);
            let cell3Content = document.createTextNode('date');
            let cell4Content = document.createTextNode(dateFormat);
            cell1.appendChild(cell3Content);
            cell2.appendChild(cell4Content);
            row.appendChild(cell1);
            row.appendChild(cell2);
            tblBody.appendChild(row);
            let row1 = document.createElement('tr');
            hourFormat = getHourFormat(date);
            let cell3 = document.createElement('td');
            cell3.style.color = 'white';
            let cell4 = document.createElement('td');
            cell4.style.color = 'white';
            let cell5Content = document.createTextNode('time');
            let cell6Content = document.createTextNode(hourFormat);
            cell3.appendChild(cell5Content);
            cell4.appendChild(cell6Content);
            row1.appendChild(cell3);
            row1.appendChild(cell4);
            tblBody.appendChild(row1);
        } else {
            cell1Content = document.createTextNode(index);
            cell2Content = document.createTextNode(event.layer.feature.properties[index]);
            cell1.appendChild(cell1Content);
            cell2.appendChild(cell2Content);
            row.appendChild(cell1);
            row.appendChild(cell2);
            tblBody.appendChild(row);
        }
    }
    table.appendChild(tblBody);
    body.appendChild(table);
    table.setAttribute('border', '2');
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
