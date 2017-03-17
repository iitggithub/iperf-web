FROM php:5.6.30-apache

MAINTAINER "The Ignorant IT Guy" <iitg@gmail.com>

# Install python and python-docker so we can spawn iperf
# docker containers from inside our iperf-web container.
# Installing docker itself would take up 2 - 3 times the
# space python/python-docker does.
RUN apt-get update && apt-get install -y python \
                                         python-docker \
    --no-install-recommends && rm -r /var/lib/apt/lists/*

# Make placeholder directories for the end user to mount against
RUN mkdir -p /var/www/html/css \
             /var/www/html/images

# Script to run new containers from inside an existing container
# Requires /var/run/docker.sock to be mounted under /var/run/docker.sock
# inside the countainer.
COPY run-container.py /usr/local/bin
RUN chmod +x /usr/local/bin/run-container.py

COPY source.tar /tmp
RUN tar xvf /tmp/source.tar -C /var/www/html >/dev/null

EXPOSE 80

VOLUME [ "/var/www/html/css", "/var/www/html/images" ]

ENTRYPOINT ["apache2-foreground"]
