# Arrancar Respiramos

## Servidor

La API de Respiramos está montada en Django versión 3.0.7

### Arrancar

Setear las variables de entorno

|   |   |
|---|---|
| SECRET_KEY|asdfadsfdsafsdaf |
| APIDBHOST|localhost|
| APIDBUSER|cansat|
| APIDBPASSWORD|cansat|
| APIDBPORT|5432|
| APIDBNAME|diy_satellites|
| APISERVER|localhost  | 


## Generar Fixtures

Antes de cargar los datos de prueba será necesario aplicar el modelo

```bash
python manage.py makemigrations
python manage.py migrate api
```

```bash
python manage.py dumpdata api.observation --indent 4 > fixtures/observations.json
```
## Cargar los datos de entrada

Descomprimir el ZIP de la carpeta SQL y cargar en la base de datos.

## Arrancar cliente con webpack

Primero deberemos comprobar si tenemos instalado npm y node y las versiones. Para ello:

```bash
npm --version
6.10.0

node --version
v12.7.0
```
Las versiones deben ser 6.x.x para npm y 12.x.x para node

Una vez comprobado deberemos instalar las dependencias

```bash
npm install
```
en la carpeta raiz del cliente donde se encuentre el `package.json`

Esto creará la carpeta `node_modules` donde se instalarán todas las dependencias del proyecto.

Para arrancar el proyecto en modo desarrollo

```bash
npm run start
```

que nos arrancará la aplicación en [http://localhost:8080](http://localhost:8080)

La aplicación se recargará de manera automática con cada cambio.

## Variables de entorno

La aplicación necesita un archivo `client/.env` similar al `.env.example`

## Neat .csv **OLD**
 Date  |    Lat    |    Long   | AltGPS | Temp  | Hum  |AltBar | Pressure |  NO2  |  CO  | NH3 | PM1.0 | PM2.5 | PM10.0 |  Date  |  Time    |
:-----:|:---------:|:---------:|:------:|:-----:|:----:|:-----:|:--------:|:-----:|:----:|:---:|:-----:|:-----:|:------:|:------:|:--------:|
line1  |40.4103952 | -3.693736 |   0    | 26.58 |  32  | 618.9 |  941.09  | 34.99 | 2.97 |  0  |   0   |   0   |   2    | 7/7/19 | 17:57:50 |
line1  |40.4103952 | -3.693736 |   0    | 26.85 | 32.03| 618.7 |  941.11  | 33.23 | 3.22 |  0  |   2   |   3   |   3    | 7/7/19 | 17:57:50 |

## Raw .csv **OLD**
Lat, Long, AltGPS, Temp, Hum, AltBar, Pressure, NO2, CO, NH3, PM1.0, PM2.5, PM10.0 ,Date, Time
40.4103952,-3.693736,0,26.58,32,618.9,941.09,34.99,2.97,0,0,0,2,7/7/19,17:57:50

## PostgreSQL
point_id |          DateTime          |                    geo                     |  Latitude  | Longitude  | AltGPS |  Temp   |  Hum  |  AltBar  | Pressure |  NO2   |   CO   | NH3 | PM1_0 | PM2_5 | PM10_0 
----------+----------------------------+--------------------------------------------+------------+------------+--------+---------+-------+----------+----------+--------+--------+-----+-------+-------+--------
        1 | 2019-09-18 16:58:20.140323 | 01010000007D76C075C58C0DC0BB3775D487344440 | 40.4103952 |  -3.693736 |      0 |   26.58 |    32 |    618.9 |   941.09 |  34.99 |   2.97 |   0 |     0 |     0 |      2
        2 | 2019-09-18 16:58:20.169652 | 0101000000DDC6B0D4C48C0DC073710AE187344440 | 40.4103967 | -3.6937348 |      0 |   26.56 | 31.99 |   619.28 |   941.05 |  34.99 |   3.04 |   0 |     2 |     2 |      4


# Devops

## Generar la imagen con el backend

`docker build -t geomatico/diysatellites:latest -f devops/Dockerfile .`

## Transferir al servidor

1. Transferimos la imagen del backend: `docker save geomatico/diysatellites | bzip2 | pv | ssh aire@respiramos.medialab-prado.es -p 7008 'bunzip2 | docker load'`
2. Transferir los ficheros necesarios: `scp -r -P 7008 devops/upload aire@serreria.medialab-prado.es:/opt/respiramos/`

## Arrancar con docker-compose

`docker-compose up`

## Instalar maestros y superusuario (sólo en primer deploy)

Entramos en el contenedor del backend:

`docker exec -ti respiramos_django_1 /bin/sh`

Restauramos backup:

`psql -U cansat -h postgis-diy -d cansat < cansat.sql`

y creamos superusuario de django:

`./manage.py createsuperuser`







