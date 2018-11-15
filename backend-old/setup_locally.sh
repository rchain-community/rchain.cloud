#!/usr/bin/env bash

#Create network on first run
NETWORK_NAME=rchain-local
if [ -z $(docker network ls --filter name=^${NETWORK_NAME}$ --format="{{ .Name }}") ] ; then
    docker network create ${NETWORK_NAME} ;
fi

#First build containers again if changes are made or if containers don't exist
docker-compose -f docker-compose-dev.yml build

# Then deploy in background
docker-compose -f docker-compose-dev.yml up -d