An Alpine-based Python 3.12 Flask web server which allows you to execute iperf, iperf3, dig, nslookup, netcat, ping, and traceroute commands from a web interface.

All versions have been built with multi-architectural support enabled (amd64, arm64, arm/v7).

# Requirements

You must have an iperf or iperf 3 server running somewhere in order to perform a network throughput test from your iperf/iperf3 client. You can deploy one or more [iitgdocker/iperf-server](https://hub.docker.com/r/iitgdocker/iperf-server) docker containers if you wish to run your own iperf servers.

You can also find public iperf3 servers at [https://github.com/R0GGER/public-iperf3-servers](https://github.com/R0GGER/public-iperf3-servers). It's highly recommended that you run your own so you can test end to end performance.

Obviously, you need network connectivity between the two hosts for any of the tests and for ping/traceroute; icmp needs to be permitted.

# Getting Started

Fire up the web server using the minimum number of arguments required.

```
docker run -d --restart=always -name iperf-web -p 5000:5000 iitgdocker/iperf-web
```

# Environment Variables

### IPERF\_WEB\_PORT

Sets the TCP port the python flask app listens on.

Possible values: number between 1025 and 65535

Default: 5000

### IPERF\_WEB\_DEBUG\_MODE

Enables Flask app debug mode

Possible values: True, False

Default: False

# Getting Rid Of The Docker Container

If you don't want to run iperf-web using a container, that's ok.

All you need from the github repository is the following files and directories:

 * app.py
 * static/
 * template/

You will then need to install the flask python module:

```
pip3 install flask
```

And any utilities not installed by default (this will depend on your os), but mtr, traceroute iperf and iperf3 are required at a minimum.

Once you have all of the network utilities installed, you can start the flask app.

```
python3 app.py
```

# The End

If you have any comments, suggestions etc. Let me know.
