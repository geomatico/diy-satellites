from django.test import TestCase, Client


class TestApi(TestCase):

    def test_get_observations(self):
        client = Client()
        url = '/api/v1/observations/'
        response = client.get(url)

        self.assertEqual(response.status_code, 200)
