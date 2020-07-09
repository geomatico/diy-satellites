from django.contrib.gis.db import models
from django.utils.translation import gettext_lazy as _


class Observation(models.Model):

    date_time = models.DateTimeField(_('date_time'))
    geom = models.PointField(_('geom'))
    altitude_gps = models.FloatField(_('altitude_gps'), default=0.0)
    temperature = models.FloatField(_('temperature'), default=0.0)
    humidity = models.FloatField(_('humidity'), default=0.0)
    altitude_bar = models.FloatField(_('altitude_bar'), default=0.0)
    pressure = models.FloatField(_('pressure'), default=0.0)
    no2 = models.FloatField(default=0.0)
    co = models.FloatField(default=0.0)
    nh3 = models.FloatField(default=0.0)
    pm1_0 = models.FloatField(default=0.0)
    pm2_5 = models.FloatField(default=0.0)
    pm10_0 = models.FloatField(default=0.0)

    class Meta:
        verbose_name = _('observation')
        verbose_name_plural = _('observations')


