FROM python:3.12-alpine

RUN pip install --no-cache-dir flask

RUN apk update && apk add traceroute \
                          iperf \
                          iperf3

COPY static /static/
COPY templates /templates/
COPY app.py .

EXPOSE 5000

CMD ["python", "app.py"]
