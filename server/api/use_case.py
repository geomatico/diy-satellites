from datetime import datetime

from django.contrib.gis.geos import fromstr

from api import constants
from api.models import Observation


def insert_observation_into_database(observation, username):
    """
    
    """
    pm1_0 = float(observation[constants.DB_PM1_0])
    pm2_5 = float(observation[constants.DB_PM2_5])
    pm10_0 = float(observation[constants.DB_PM10_0])
    date = datetime.strptime(observation[constants.DB_DATE], constants.DATE_FORMAT)
    time = datetime.strptime(observation[constants.DB_TIME], constants.FORMAT_TIME)
    latitude = float(observation[constants.DB_LATITUDE])
    longitude = float(observation[constants.DB_LONGITUDE])
    geom = fromstr('POINT({longitude} {latitude})'.format(longitude=longitude, latitude=latitude), srid=4326)

    observation_to_db = Observation(
        pm1_0=pm1_0,
        pm2_5=pm2_5,
        pm10_0=pm10_0,
        date=date,
        time=time,
        geom=geom,
        username=username)

    return observation_to_db.save()
