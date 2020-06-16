from rest_framework import viewsets

from api.models import Observation
from api.serializers import ObservationSerializer


class ObservationsViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = Observation.objects.all()
    serializer_class = ObservationSerializer
