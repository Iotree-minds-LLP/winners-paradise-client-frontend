#!/bin/bash
npm install .
npm run build
mkdir /var/www/html/winners-paradise-client-frontend
sudo cp -r ./build/* /var/www/html/winners-paradise-client-frontend/
sudo chown -R www-data:www-data /var/www/html/winners-paradise-client-frontend/
sudo chmod -R 755 /var/www/html/winners-paradise-client-frontend/
