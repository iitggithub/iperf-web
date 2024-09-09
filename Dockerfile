FROM python:3.12-alpine

RUN pip install --no-cache-dir flask

RUN apk update && apk add mtr \
                          traceroute \
                          bind-tools \
                          iperf \
                          iperf3

# Security updates
RUN apk upgrade libexpat

COPY static /app/static/
COPY templates /app/templates/
COPY app.py /app/

EXPOSE 5000

RUN adduser -D iperf-web
RUN chown -R iperf-web:iperf-web /app

USER iperf-web
CMD ["python", "/app/app.py"]
