FROM python:3.12-alpine

LABEL maintainer="IITG <iitggithub@gmail.com>"

RUN pip install --no-cache-dir flask

RUN apk update && apk add --no-cache mtr \
                                     traceroute \
                                     bind-tools \
                                     iperf \
                                     iperf3

# Security updates
RUN apk upgrade libexpat openssl

COPY static /app/static/
COPY templates /app/templates/
COPY app.py /app/

EXPOSE 5000

# This stuff satisfies Dockerhub but it breaks
# compatibility with Arm devices because they
# can't execute ping, traceroute etc without
# suid bit set.
#RUN adduser -D iperf-web
#RUN chown -R iperf-web:iperf-web /app
#USER iperf-web

CMD ["python", "/app/app.py"]
