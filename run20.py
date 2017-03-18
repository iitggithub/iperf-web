#! /usr/bin/python -W ignore

# Script to start docker iperf containers.
#
# run20.py uses python docker api version >2. Documentation can be
# found https://docker-py.readthedocs.io/en/stable/containers.html
#
# If you want to use this script the docker.sock socket needs to be
# mounted on /var/run/docker.sock otherwise it will fail to connect.

import docker   # Docker API access
import argparse # Command line argument parser

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
	parser.add_argument('-d', '--docker', default=False, action='store_true', \
            help='If this is set to 1, don\'t try to stream container log output.')

	args = parser.parse_args()

	return args

# Get command line arguments
args = get_args()

# Tells us whether we're a container without needing to use extra
# modules
iAmContainer = args.docker

# create the full image name including the docker tag
image = args.image + ':' + args.tag

# Connect to docker
client = docker.DockerClient(base_url=args.socket,version=args.api)

# Spawn the container and print the output to stdout
# remove the container when done.
# for mainly stolen from https://github.com/docker/docker-py/issues/919
line = ''
for char in client.containers.run(image, args.commands, remove=True):
	if char == '\n':
		print line
		line = ''
	else:
		line = line + char
