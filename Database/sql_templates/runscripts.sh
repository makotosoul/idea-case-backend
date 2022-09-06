#!/usr/bin/bash
cat *.sql |sudo mariadb -p
echo "Done!"
