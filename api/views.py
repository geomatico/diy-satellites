from datetime import datetime

from rest_framework import viewsets, views
from rest_framework.parsers import FileUploadParser
from rest_framework.response import Response

from api.models import Observation
from api.serializers import ObservationSerializer
from api import Constans
import csv


class ObservationsViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = Observation.objects.all()
    serializer_class = ObservationSerializer

    def list(self, request, *args, **kwargs):
        FORMAT_DATE = "%Y-%m-%dT%H:%M:%SZ"

        observations = self.queryset
        if request.query_params:
            init_date = datetime.strptime(request.query_params['init_date'], FORMAT_DATE)
            end_date = datetime.strptime(request.query_params['end_date'], FORMAT_DATE)
            observations = Observation.objects.filter(datetime__range=(init_date, end_date))
        serializer = ObservationSerializer(observations, many=True)
        return Response(serializer.data)


class UploadCsv(views.APIView):
    parser_classes = [FileUploadParser]

    def post(self, request, filename, format=None):
        csv_file = request.data['file']
        file_data = csv_file.read().decode("utf-8")
        with open(file_data) as f:
            reader = csv.reader(f)
            for row in reader:
                observation = Observation(
                    datetime=row[Constans.DB_DATETIME],
                    geom=row[Constans.DB_LON, Constans.DB_LAT],
                    altGPS=row[Constans.DB_ALTGPS],
                    temp=row[Constans.DB_TEMP],
                    hum=row[Constans.DB_HUM],
                    altBar=row[Constans.DB_ALTBAR],
                    pressure=row[Constans.DB_PRESSURE],
                    NO2=row[Constans.DB_NO2],
                    CO=row[Constans.DB_CO],
                    NH3=row[Constans.DB_NH3],
                    PM1_0=row[Constans.DB_PM1_0],
                    PM2_5=row[Constans.DB_PM2_5],
                    PM10_0=row[Constans.DB_PM10_0]
                )
                observation.save()
        return Response(status=204)

