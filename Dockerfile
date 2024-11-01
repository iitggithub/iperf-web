FROM python:3.13-alpine

LABEL maintainer="IITG <iitggithub@gmail.com>"

RUN set -eux; \
    mkdir -p /app/config; \
    apk update; \
    apk add --no-cache mtr \
                       tcptraceroute \
                       traceroute \
                       bind-tools \
                       iperf \
                       iperf3; \
    chmod u+s /usr/sbin/mtr /usr/bin/traceroute /usr/bin/tcptraceroute /bin/ping; \
    rm -rf /var/cache/apk/*

RUN pip install flask

# Security updates
RUN apk upgrade libexpat openssl

COPY config/config_example.json /app/config/
COPY static /app/static/
COPY templates /app/templates/
COPY app.py /app/

VOLUME ["/app/config"]

EXPOSE 5000

RUN adduser -D iperf-web
RUN chown -R iperf-web:iperf-web /app
USER iperf-web

WORKDIR /app

CMD ["python", "app.py"]
