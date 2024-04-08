#! /bin/bash

# Get the latest code changes from git repositories
cd ~/siba/Siba_be
git pull
cd ~/siba/siba-fe
git pull

# Stop and remove current containers
sudo docker compose -f ~/siba/Siba_be/docker-compose-dbbe-deploy.yaml down
sudo docker compose -f ~/siba/siba-fe/docker-compose-fe-nginx.yaml down

# Rebuild the new images and start containers
sudo docker compose -f ~/siba/Siba_be/docker-compose-dbbe-deploy.yaml up -d --build
sudo docker compose -f ~/siba/siba-fe/docker-compose-fe-nginx.yaml up -d --build
