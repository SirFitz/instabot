#!/bin/bash

PORT="${PORT:-3006}"
USERNAME="${USERNAME:-default_username}"
PASSWORD="${PASSWORD:-default_password}"
git pull
docker build --build-arg username="$USERNAME" --build-arg password="$PASSWORD" -t instabot .
docker kill instabot
docker rm instabot
docker run -d -p $PORT:3006 --restart=unless-stopped --name=instabot instabot
