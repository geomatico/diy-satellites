from django.contrib import admin
from django.urls import path, include
from rest_framework import routers

from api.views import ObservationsViewSet

router = routers.DefaultRouter()
router.register(r'observations', ObservationsViewSet)

urlpatterns = [
    path(r'', include(router.urls)),
    path('admin/', admin.site.urls),
]
