from rest_framework_gis.serializers import GeoFeatureModelSerializer

from api.models import Observation, ObservationByGrid


class ObservationSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Observation
        geo_field = "geom"
        fields = ('date_time', 'altitude_gps', 'temperature', 'humidity', 'altitude_bar', 'pressure', 'no2', 'co',
                  'nh3', 'pm1_0', 'pm2_5', 'pm10_0')


class ObservationByGridSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = ObservationByGrid
        geo_field = "geom"
        fields = ('id', 'temperature', 'humidity', 'no2', 'co', 'nh3', 'pm1_0', 'pm2_5', 'pm10_0')
