An Alpine-based Python 3.12 Flask web server which allows you to execute iperf, iperf3, dig, nslookup, netcat, ping, and traceroute commands from a web interface.

All versions have been built with multi-architectural support enabled (amd64, arm64, arm/v7).

# Requirements

You must have an iperf or iperf 3 server running somewhere in order to perform a network throughput test from your iperf/iperf3 client. You can deploy one or more [iitgdocker/iperf-server](https://hub.docker.com/r/iitgdocker/iperf-server) docker containers if you wish to run your own iperf servers.

You can also find public iperf3 servers at [https://github.com/R0GGER/public-iperf3-servers](https://github.com/R0GGER/public-iperf3-servers). It's highly recommended that you run your own so you can test end to end performance.

Obviously, you need network connectivity between the two hosts for any of the tests and for ping/traceroute; icmp needs to be permitted.

# Getting Started

Run the web server using the minimum number of arguments required.

```
sudo docker run -d --restart=always -name iperf-web -p 5000:5000 iitgdocker/iperf-web
```

# How To Save Server Connection Details

If you have a list of servers that you regularly perform testing against or you plan to deploy multiple iperf-web servers and perform testing between them, you can save the connection details in a list. You can then select a configuration and it will prefill the fields for that test type.

![Server Configuration Details](https://github.com/iitggithub/iperf-web/blob/master/NTU_Server_Details.png?raw=true)

You need to mount a directory from your docker host into the iperf-web docker container. This allows you to edit the config.json file from the docker host and ensure that the contents of the file persists between container restarts.

In the example below, we mount the /opt/iperf-web/config directory on the docker host to the /app/config directory in the docker container.

```
sudo mkdir -p /opt/iperf-web/config
sudo docker run -d --restart=always -name iperf-web -p 5000:5000 -v /opt/iperf-web/config:/app/config iitgdocker/iperf-web
```

2\. Configure the config.json file according to your requirements

Note: An example has been provided in the config directory called config_example.json. You don't have to include every field name, just the fields you wish to change.

You will need to know the name of the test ie dig, iperf, mtr, nc, nslookup, ping, traceroute etc and the name of each of the fields you wish to prefill.

Because the test types and field names may change at any time, I recommend reviewing the [https://github.com/iitggithub/iperf-web/blob/master/templates/index.html](https://github.com/iitggithub/iperf-web/blob/master/templates/index.html) file directly.

```
{
    "dig": [
        {
            "name": "ineedmyip.com",
            "dig_target": "ineedmyip.com",
            "dig_parameters": "+short"
        },
        {
            "name": "ineedmyip.com reverse DNS",
            "dig_target": "140.82.49.8",
            "dig_parameters": "-x"
        }
    ],
    "iperf": [
        {
            "name": "Server 1",
            "iperf_version": "3",
            "iperf_target": "192.168.1.111",
            "iperf_port": "5201",
            "iperf_conn_type": "TCP",
            "iperf_timeout": "10",
            "iperf_parameters": "--format m"
        },
        {
            "name": "Server 2",
            "iperf_version": "2",
            "iperf_target": "192.168.1.222",
            "iperf_port": "5201",
            "iperf_conn_type": "UDP",
            "iperf_timeout": "15",
            "iperf_parameters": "--bandwidth 10M"
        }
    ],
    "nc": [
        {
            "name": "ineedmyip.com SSH port 22",
            "nc_target": "ineedmyip.com",
            "nc_port": "22"
        }
    ],
    "ping": [
        {
            "name": "8.8.8.8",
            "ping_target": "8.8.8.8",
            "ping_count": "4"
        }
    ]
}
```

3. Restart the container if it's already running

Note: This is required to make sure the container uses the updated image

```
sudo docker pull iitgdocker/iperf-web:latest
sudo docker stop iperf-web
sudo docker rm iperf-web
sudo docker run -d --restart=always -name iperf-web -p 5000:5000 -v /opt/iperf-web/config:/app/config iitgdocker/iperf-web

```

Using the configuration above, a dropdown box will appear when the Dig, Iperf or Ping test types are selected and allow you to select the appropriate configure based on the configuration name. Selecting a configration will automatically prefill those fields.

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
