#!/bin/bash

git pull
docker build -t instabot .
docker kill instabot
docker rm instabot
docker run -d -p 3006:3006 --restart=unless-stopped --name="instabot" instabot

