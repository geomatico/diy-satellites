#Delay
sleep 20

# Aplicamos migraciones
python manage.py migrate

# Recolectamos los ficheros estáticos
python manage.py collectstatic --noinput

# Arrancamos la app con gunicorn
gunicorn diysatellite.wsgi:application -b 0.0.0.0:80