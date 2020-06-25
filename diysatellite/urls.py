from django.contrib import admin
from django.urls import path, include

import diysatellite

urlpatterns = [
    path('grappelli/', include('grappelli.urls')),
    path('admin/', admin.site.urls),
    path('api/v1/', include('api.urls')),
]
