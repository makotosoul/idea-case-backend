#! /bin/bash

cd ~/siba/Siba_be
git switch main
git pull

sudo systemctl start docker
sudo docker compose -f ~/siba/Siba_be/docker-compose-dbbe-deploy.yaml down
sudo docker compose -f ~/siba/Siba_be/docker-compose-dbbe-deploy.yaml up -d --build
