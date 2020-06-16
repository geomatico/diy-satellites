from rest_framework import viewsets, generics

from api.models import Observation
from api.serializers import ObservationSerializer


class ObservationsViewSet(viewsets.ModelViewSet):
    queryset = Observation.objects.all()
    serializer_class = ObservationSerializer

