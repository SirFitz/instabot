#!/bin/bash

docker run -d -p 3006:3006 --name instabot-app --restart unless-stopped instabot
