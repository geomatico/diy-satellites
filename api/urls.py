from django.urls import include, path, re_path
from rest_framework.routers import DefaultRouter

from api.views import ObservationsViewSet, UploadCsv

router = DefaultRouter()
router.register(r'observations', ObservationsViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('upload', UploadCsv.as_view())
]
