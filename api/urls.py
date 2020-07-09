from django.urls import include, path
from rest_framework.routers import DefaultRouter

from api.views import ObservationsViewSet, UploadCsv

router = DefaultRouter()
router.register(r'observations', ObservationsViewSet)

urlpatterns = [
    path('upload/', UploadCsv.as_view()),
    path('', include(router.urls)),

]
