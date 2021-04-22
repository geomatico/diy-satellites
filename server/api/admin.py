from django.contrib.gis import admin
from .models import Observation
from django.contrib.auth.models import Group


class ObservationAdmin(admin.ModelAdmin):
    exclude = ('geom',)
    list_display = ('id', 'pm1_0', 'pm2_5', 'pm10_0', 'date', 'time', 'username')


admin.site.register(Observation, ObservationAdmin)
admin.site.unregister(Group)
