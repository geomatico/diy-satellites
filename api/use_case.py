from datetime import datetime

from django.contrib.gis.geos import fromstr

from api import constants
from api.models import Observation


def insert_observation_into_database(observation):
    """
    
    """
    datetime_format = datetime.strptime(observation[constants.DB_DATETIME], constants.DATE_FORMAT)
    longitude = float(observation[constants.DB_LONGITUDE])
    latitude = float(observation[constants.DB_LATITUDE])
    geom = fromstr('POINT({longitude} {latitude})'.format(longitude=longitude, latitude=latitude), srid=4326)
    altitude_gps = float(observation[constants.DB_ALTITUDE_GPS])
    temperature = float(observation[constants.DB_TEMPERATURE])
    humidity = float(observation[constants.DB_HUMIDITY])
    altitude_bar = float(observation[constants.DB_ALTITUDE_BAR])
    pressure = float(observation[constants.DB_PRESSURE])
    no2 = float(observation[constants.DB_NO2])
    co = float(observation[constants.DB_CO])
    nh3 = float(observation[constants.DB_NH3])
    pm1_0 = float(observation[constants.DB_PM1_0])
    pm2_5 = float(observation[constants.DB_PM2_5])
    pm10_0 = float(observation[constants.DB_PM10_0])

    observation_to_db = Observation(
        date_time=datetime_format,
        geom=geom,
        altitude_gps=altitude_gps,
        temperature=temperature,
        humidity=humidity,
        altitude_bar=altitude_bar,
        pressure=pressure,
        no2=no2,
        co=co,
        nh3=nh3,
        pm1_0=pm1_0,
        pm2_5=pm2_5,
        pm10_0=pm10_0)

    return observation_to_db.save()
