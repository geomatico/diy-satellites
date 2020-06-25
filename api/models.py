from django.contrib.gis.db import models
from django.utils.translation import gettext_lazy as _


class Observation(models.Model):
    observationId = models.IntegerField(primary_key=True)
    datetime = models.DateTimeField(_('datetime'))
    geom = models.PointField(_('geom'))
    altGPS = models.FloatField(_('altGPS'), default=0.0)
    temp = models.FloatField(_('temp'), default=0.0)
    hum = models.FloatField(_('hum'), default=0.0)
    altBar = models.FloatField(_('altBar'), default=0.0)
    pressure = models.FloatField(_('pressure'), default=0.0)
    NO2 = models.FloatField(default=0.0)
    CO = models.FloatField(default=0.0)
    NH3 = models.FloatField(default=0.0)
    PM1_0 = models.FloatField(default=0.0)
    PM2_5 = models.FloatField(default=0.0)
    PM10_0 = models.FloatField(default=0.0)

    class Meta:
        verbose_name = _('observation')
        verbose_name_plural = _('observations')


class User(models.Model):
    name = models.CharField(_('name'), max_length=30)
    surname = models.CharField(_('surname'), max_length=50)
    dni = models.CharField(unique=True, max_length=9)
    password = models.CharField(max_length=20)
    mail = models.EmailField()

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')
