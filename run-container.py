#! /usr/bin/python

# Script to start docker iperf containers.
#
# Since python-docker is < 2, documentation for this can be found
# http://docker-py.readthedocs.io/en/1.10.0/api/#containers
#
# If you want to use this script the docker.sock socket needs to be
# mounted on /var/run/docker.sock otherwise it will fail to connect.

from docker import Client # Docker API access
import argparse           # Command line argument parser

def get_args():
	"""
        Supports the command-line arguments listed below.
	"""

	parser = argparse.ArgumentParser( \
            'Connects to docker via a unix socket and runs commands against it.')
	parser.add_argument('-i', '--image', default='iitgdocker/iperf', action='store', \
            help='The docker image to use')
	parser.add_argument('-t', '--tag', default='latest', action='store', \
            help='The image tag to use')
	parser.add_argument('-c', '--commands', required=True, action='store', \
            help='command line arguments to be passed to the iperf command')
	parser.add_argument('-s', '--socket', default='unix://var/run/docker.sock', action='store', \
            help='The path to the socket that will be used to connect and control docker')
	parser.add_argument('-a', '--api', default='1.20', action='store', \
            help='The docker API version to use when connecting to the socket')

	args = parser.parse_args()

	return args

# Get command line arguments
args = get_args()

# create the full image name including the docker tag
image = args.image + ':' + args.tag

# Connect to docker
client = Client(base_url=args.socket,version=args.api)

# Spawn the container. Since this script is being launched as a background
# job, there's no need to add detech=True to the list of arguments given to
# client.create_container.
container = client.create_container(image=image, command=args.commands)

# Get the container ID
container_id = container['Id']

# Start the container
client.start(container=container_id)

# block (wait) until the container finishes running
client.wait(container_id)

# Whether it worked or not, delete the container
client.remove_container(container_id)
