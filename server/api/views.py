from datetime import datetime

from rest_framework import viewsets, views
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from api.models import Observation, ObservationByGrid
from api.serializers import ObservationSerializer, ObservationByGridSerializer
from api import constants
import csv
import io

from api.use_case import insert_observation_into_database


class ObservationsViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = Observation.objects.all()
    serializer_class = ObservationSerializer

    def list(self, request, *args, **kwargs):

        observations = Observation.objects.all()
        if request.query_params:
            init_date = datetime.strptime(request.query_params['init_date'], constants.FORMAT_DATE)
            end_date = datetime.strptime(request.query_params['end_date'], constants.FORMAT_DATE)
            observations = Observation.objects.filter(date__range=(init_date, end_date))
        serializer = ObservationSerializer(observations, many=True)
        return Response(serializer.data)


class ObservationByGridViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = ObservationByGrid.objects.all()
    serializer_class = ObservationByGridSerializer

    def list(self, request, *args, **kwargs):

        observations_by_grid = ObservationByGrid.objects.all()
        serializer = ObservationByGridSerializer(observations_by_grid, many=True)
        return Response(serializer.data)


def blank_line_exist(row):
    if not row:
        return True
    return False


class UploadCsv(views.APIView):
    permission_classes = (IsAuthenticated,)
    parser_classes = [MultiPartParser, ]

    def post(self, request):

        username = request.user
        csv_file = request.data['file']
        file_data = csv_file.read().decode("utf-8").replace('\r', '\n')
        io_string = io.StringIO(file_data)
        next(io_string)

        for observation_from_csv in csv.reader(io_string, delimiter=';', quotechar='|'):
            if blank_line_exist(observation_from_csv):
                continue
            try:
                inserted = insert_observation_into_database(observation_from_csv, username)
            except Exception as err:
                print(err)
                return Response(status=500)

        return Response(status=204)
