FROM python:3.7.9-alpine
ENV PYTHONUNBUFFERED 1

RUN mkdir /code
WORKDIR /code
COPY server/requirements.txt .

RUN apk add --no-cache --repository http://dl-cdn.alpinelinux.org/alpine/edge/main openssl \
    build-base cmake musl-dev linux-headers && \
    apk add --no-cache --repository http://dl-cdn.alpinelinux.org/alpine/edge/testing gdal-dev geos-dev proj && \
    apk add --no-cache postgresql-libs postgresql-client && \
    apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev&& \
    pip install --upgrade pip && \
    pip install -r requirements.txt --no-cache-dir && \
    pip install gdal --no-cache-dir && \
    apk --purge del .build-deps

COPY server .

COPY devops/assets .
