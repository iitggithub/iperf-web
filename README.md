An Alpine-based Python 3.12 Flask web server which allows you to execute iperf, iperf3, ping and traceroute commands from a web interface.

# Requirements

You must have a running iperf or iperf 3 server running somewhere in order to perform an iperf/iperf3 test to it.

Obviously, you need network connectivity between the two hosts for any of the tests and for ping/traceroute; icmp needs to be permitted..

# Getting Started

There's two ways to get up and running, the easy way and the hard way.

## The Hard Way (Standalone)

Fire up the web server using the minimum number of arguments required.

```
sudo docker run --rm -p 5000:5000 iitgdocker/iperf-web
```

## The Easy Way (Docker Compose)

The github repo contains a docker-compose.yml you can use as a base. The docker-compose.yml is compatible with docker-compose 1.5.2+. Below is an example but you can always find the latest version on github.

```
server:
  image: iitgdocker/iperf-web:latest
  ports:
    - "5000:5000"
```

# Environment Variables

None.

# Making The Container Start On Boot

You'll need docker-compose for this or knowledge enough to edit a systemd service file.

On the iperf-web github page for this image, you'll find a file called docker-iperf-web.service. Copy this file into /usr/lib/systemd/system.

The service file expects the working directory (containing the docker-compose.yml file) to be located under /data/iperf-web. If yours is not here, you'll need to edit the docker-iperf-web.service service file and update the WorkingDirectory parameter.

Once your done, run systemctl enable docker-iperf-web.

Finally start the container by running systemctl start docker-iperf-web. Now your container will be brought up every time your system boots up.

# Getting Rid Of The Docker Container

If you don't want to run iperf-web using a container, that's ok.

 All you need is the app.py python script, and the static and template directories and provided you have the python3 flask module installed via pip, you can simply run the web interface using the command below:

```
python3 app.py
```

# The End

If you have any comments, suggestions etc. Let me know.
