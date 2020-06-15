# Generated by Django 3.0.7 on 2020-06-15 14:17

import django.contrib.gis.db.models.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Observation',
            fields=[
                ('observationId', models.IntegerField(primary_key=True, serialize=False)),
                ('datetime', models.DateTimeField()),
                ('geom', django.contrib.gis.db.models.fields.PointField(srid=4326)),
                ('altGPS', models.FloatField(default=0.0)),
                ('temp', models.FloatField(default=0.0)),
                ('hum', models.FloatField(default=0.0)),
                ('altBar', models.FloatField(default=0.0)),
                ('pressure', models.FloatField(default=0.0)),
                ('NO2', models.FloatField(default=0.0)),
                ('CO', models.FloatField(default=0.0)),
                ('NH3', models.FloatField(default=0.0)),
                ('PM1_0', models.FloatField(default=0.0)),
                ('PM2_5', models.FloatField(default=0.0)),
                ('PM10_0', models.FloatField(default=0.0)),
            ],
        ),
    ]
