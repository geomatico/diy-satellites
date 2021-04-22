from rest_framework_gis.serializers import GeoFeatureModelSerializer

from api.models import Observation, ObservationByGrid


class ObservationSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Observation
        geo_field = "geom"
        fields = ('pm1_0', 'pm2_5', 'pm10_0', 'date', 'time', 'username', )


class ObservationByGridSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = ObservationByGrid
        geo_field = "geom"
        fields = ('id', 'pm1_0', 'pm2_5', 'pm10_0', 'username', )
