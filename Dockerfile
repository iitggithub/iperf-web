FROM php:5.6.30-alpine

MAINTAINER "The Ignorant IT Guy" <iitg@gmail.com>

# Make placeholder directories for the end user to mount against
RUN mkdir -p /var/www/html/css \
             /var/www/html/images

COPY source.tar /tmp
RUN tar xvf /tmp/source.tar -C /var/www/html >/dev/null

EXPOSE 80

VOLUME [ "/var/www/html/css", "/var/www/html/images" ]

ENTRYPOINT ["apache2-foreground"]
