from unittest import skip

from django.test import TestCase, Client
from rest_framework.test import RequestsClient
import os


class TestApi(TestCase):

    fixtures = [
        './fixtures/observations.json'
    ]

    def test_get_observations(self):
        client = Client()
        url = '/api/v1/observations/'
        response = client.get(url)

        observations = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(observations['features'][0]['properties']['pm2_5'], 23.0)
        self.assertEqual(observations['features'][15]['properties']['pm1_0'], 3328.0)
        self.assertEqual(observations['features'][16]['properties']['pm2_5'], 2560.0)
        self.assertEqual(len(observations['features']), 260)

    def test_get_observations_filter_by_date(self):

        client = Client()

        init_date = "2020-09-20T13:54:00.000Z"
        end_date = "2020-09-23T13:55:00.000Z"
        url = '/api/v1/observations/?init_date={init_date}&end_date={end_date}'.format(init_date=init_date,
                                                                                       end_date=end_date)

        response = client.get(url)
        observations = response.json()

        self.assertEqual(observations['features'][1]['properties']['pm10_0'], 14.0)
        self.assertEqual(len(observations['features']), 4)
        self.assertEqual(response.status_code, 200)

        init_date = "2020-10-01T23:59:59.000Z"
        end_date = "2020-10-01T00:00:29.000Z"
        url = '/api/v1/observations/?init_date={init_date}&end_date={end_date}'.format(init_date=init_date,
                                                                                       end_date=end_date)
        response = client.get(url)
        observations = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(observations['features']), 1)
        self.assertEqual(observations['features'][0]['properties']['pm1_0'], 18.0)
        self.assertEqual(observations['features'][0]['properties']['pm2_5'], 28.0)
        self.assertEqual(observations['features'][0]['properties']['pm10_0'], 28.0)



    @skip
    def test_upload_csv(self):

        client = RequestsClient()

        url = 'http://localhost:8000/api/v1/upload/'
        file_path = './fixtures/observations.csv'

        payload = {}
        headers = {
            'Content-Disposition': 'attachment; filename={filename}'.format(filename=os.path.basename(file_path)),
        }
        files = [
            ('file', open(file_path, 'r'))
        ]
        response = client.post(url, headers=headers, data=payload, files=files)

        self.assertEqual(response.status_code, 204)

    def test_blank_line_exits(self):
        ## Abrir el archivo CSV
        ## Pasarselo al blank_lines
        ## comprobar que la última linea es 999999
