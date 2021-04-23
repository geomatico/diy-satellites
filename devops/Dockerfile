FROM python:3.7.9-slim-buster
ENV PYTHONUNBUFFERED 1

RUN mkdir /code
WORKDIR /code
COPY server/requirements.txt .

RUN apt-get update && apt-get install -y binutils libproj-dev gdal-bin postgresql-client && \
    pip install --upgrade pip && \
    pip install -r requirements.txt --no-cache-dir

COPY server .

COPY devops/assets .
