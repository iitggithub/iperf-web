FROM php:5.6.30-apache

MAINTAINER "The Ignorant IT Guy" <iitg@gmail.com>

# Install python and python docker API so we can spawn iperf
# docker containers from inside our iperf-web container.
# Installing docker itself would take up 2 - 3 times the
# space python/python-docker does.
RUN apt-get update && apt-get install -y sudo \
                                         python \
                                         python-pip \
                                         traceroute \
    --no-install-recommends && rm -r /var/lib/apt/lists/*

# Installs the latest version of the docker python API
RUN pip install docker

# The web user needs to run the script as root in order to use
# /var/run/docker.sock inside the container.
RUN echo "www-data ALL=(ALL) NOPASSWD:/usr/local/bin/run20.py,/usr/local/bin/run10.py" >>/etc/sudoers

# Script to run new containers from inside an existing container
# Requires /var/run/docker.sock to be mounted under /var/run/docker.sock
# inside the countainer.
COPY run20.py /usr/local/bin
RUN chmod +x /usr/local/bin/run20.py

COPY source.tar /tmp
RUN tar xvf /tmp/source.tar -C /var/www/html

VOLUME [ "/var/www/html/images" ]

EXPOSE 80

ENTRYPOINT ["apache2-foreground"]
