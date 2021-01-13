from django.contrib.gis.db import models
from django.utils.translation import gettext_lazy as _


class Observation(models.Model):
    pm1_0 = models.FloatField(_('pm1_0'), default=0.0)
    pm2_5 = models.FloatField(_('pm2_5'), default=0.0)
    pm10_0 = models.FloatField(_('pm10_0'), default=0.0)
    date = models.DateField(_('date'))
    time = models.TimeField(_('time'))
    geom = models.PointField(_('geom'))
    username = models.CharField(_('username'), max_length=50)

    class Meta:
        verbose_name = _('observation')
        verbose_name_plural = _('observations')


class ObservationByGrid(models.Model):
    id = models.IntegerField(primary_key=True)
    pm1_0 = models.FloatField(default=0.0)
    pm2_5 = models.FloatField(default=0.0)
    pm10_0 = models.FloatField(default=0.0)
    geom = models.PolygonField(_('geom'))
    username = models.CharField(_('username'), max_length=50)

    class Meta:
        managed = False
        db_table = 'api_observation_by_grid'
