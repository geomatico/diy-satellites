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
        self.assertEqual(observations['features'][17]['properties']['pm1_0'], 11.0)
        self.assertEqual(len(observations['features']), 260)

    @skip
    def test_get_observations_filter_by_date(self):

        client = Client()

        init_date = "2020-09-11T13:54:00.000Z"
        end_date = "2020-09-11T13:55:00.000Z"
        url = '/api/v1/observations/?init_date={init_date}&end_date={end_date}'.format(init_date=init_date,
                                                                                       end_date=end_date)

        response = client.get(url)
        observations = response.json()

        self.assertEqual(observations['features'][1]['properties']['pm10_0'], 29.0)
        self.assertEqual(len(observations['features']), 4)
        self.assertEqual(response.status_code, 200)

        init_date = "2020-06-16T23:59:59.000Z"
        end_date = "2020-06-17T00:00:29.000Z"
        url = '/api/v1/observations/?init_date={init_date}&end_date={end_date}'.format(init_date=init_date,
                                                                                       end_date=end_date)
        response = client.get(url)
        observations = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(observations['features']), 0)

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



