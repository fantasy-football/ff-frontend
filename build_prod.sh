#!/bin/bash

/home/sivasama/wcfl-frontend-design/node_modules/@angular/cli/bin/ng build --prod
sudo cp -r /home/sivasama/wcfl-frontend-design/dist/wcfl/* /var/www/html/
sudo nginx -t
