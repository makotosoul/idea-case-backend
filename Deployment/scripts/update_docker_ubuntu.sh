#! /bin/bash

# This script updates Docker packages to the latest version

sudo systemctl stop docker
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl restart docker
