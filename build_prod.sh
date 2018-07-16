#!/bin/bash

/path/to/ng build --prod
sudo cp -r /path/to/dist/* /var/www/html/
sudo nginx -t
