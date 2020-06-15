from rest_framework import serializers

from api.models import Observation


class ObservationSerializer(serializers.ModelSerializer):
    class Meta:
        queryset = Observation.objects.all()
        fields = "__all__"
