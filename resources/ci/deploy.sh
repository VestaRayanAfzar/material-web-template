#!/usr/bin/env bash

CLONE_PATH=$1
DEPLOY_PATH=$2
USE_SSL=$3
NGINX_PATH=$4
NGINX_CONFIG_FILE_NAME=$5
WD=`pwd`
counter=0

print_status() {
  ((counter=counter+1))
  echo
  echo "${counter}:    $1"
}

cd ${CLONE_PATH}
print_status "Cloning SubModules..."
git checkout master
git submodule update --init src/app/cmn
git submodule foreach git checkout master

mv resources/gitignore/src/app/config/setting.var.ts src/app/config/setting.var.ts

print_status "Installing Node Packages"
npm install --no-progress
print_status "Running Deploy Tasks"
gulp deploy

print_status "Configuring NGINX"
cd ${WD}
mv ${CLONE_PATH}/resources/docker/nginx.conf ${NGINX_PATH}/${NGINX_CONFIG_FILE_NAME}.conf
cd ${CLONE_PATH}

print_status "Installing Node Packages for Web Server"
cd build/app/server
npm install --production --no-progress

cd ${WD}
if [ -d ${DEPLOY_PATH} ]; then
  print_status "Stopping Previously Running Containers"
  cd ${DEPLOY_PATH}
  docker-compose stop
  docker-compose down
  cd ${WD}
fi

rm -rf ${DEPLOY_PATH}
mkdir -p ${DEPLOY_PATH}
mv ${CLONE_PATH}/build/app ${DEPLOY_PATH}/app
mv ${CLONE_PATH}/resources/docker/docker-compose.yml ${DEPLOY_PATH}/docker-compose.yml

print_status "Starting Containers"
cd ${DEPLOY_PATH}
docker-compose up -d --build
print_status "All done"
print_status "Warning! DO NOT FORGET to update the volumes, networks, external_links, and ${NGINX_CONFIG_FILE_NAME}.conf of the NGINX docker-compose file"
exit 0