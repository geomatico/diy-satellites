from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token

from api.views import ObservationsViewSet, UploadCsv

router = DefaultRouter()
router.register(r'observations', ObservationsViewSet)

urlpatterns = [
    path('upload/', UploadCsv.as_view()),
    path('api-token-auth/', obtain_auth_token),
    path('', include(router.urls)),

]
