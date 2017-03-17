A docker container running Apache with PHP 5.6. This container is specifically designed to work with the iitgdocker iperf-server containers.

# Getting Started

There's two ways to get up and running, the easy way and the hard way.

## The Hard Way (Standalone)

Fire up the web server.

```
docker run -d --name iperf-web -v /var/run/docker.sock:/var/run/docker.sock -v /data/iperf-web/logs:/var/log/httpd -v /data/iperf-web/css:/var/www/html/css iitgdocker/iperf-web:latest
```

## The Easy Way (Docker Compose)

The github repo contains a docker-compose.yml you can use as a base. The docker-compose.yml is compatible with docker-compose 1.5.2+. Below is an example but you can always find the latest version on github.

```
server:
  image: iitgdocker/iperf-web:latest
  ports:
    - "80:80"
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock
    - /data/iperf-web/css:/var/www/html/css
    - /data/iperf-web/images:/var/www/html/images
    - /data/iperf-web/logs:/var/log/httpd
```

# Volumes

## Docker socket (/var/run/docker.sock)

You'll need to mount this in order for iperf-web to spawn iperf containers. Usually this will be stored under /var/run/docker.sock on your docker host.

## Log files

You can access the default apache log file directory by mounting a volume against /var/log/httpd.

## CSS override

Mount a volume against /var/www/html/css and this will allow you to put a CSS file (must be named style.css). This allows you to re-brand the web interface with your own stylesheet.

## Images

It's worthwhile adding a company logo etc. Mount a volume against /var/www/html/images and throw your logo image (must be named logo.png) into the directory and let the web interface do the rest.

# Environment Variables

None.

# Getting Rid Of The Docker Container

If you don't want to run iperf-web using a container, that's ok. Grab source.tar and untar on your own webserver (needs php). Just make sure you select "iperf" as your program type on the web interface.

# The End

If you have any comments, suggestions etc. Let me know.
