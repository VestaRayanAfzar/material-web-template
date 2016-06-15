#!/usr/bin/env bash

CLONE_PATH=$1
DEPLOY_PATH=$2
WD=`pwd`

counter=1
print_status(){
  echo
  echo "## ${counter}:    $1"
  ((counter=counter+1))
}

cd "$CLONE_PATH"
print_status "Cloning Sub Modules"
git checkout master
git submodule update --init src/app/cmn
git submodule foreach git checkout master

mv resources/gitignore/src/app/config/setting.var.ts src/app/config/setting.var.ts

print_status "Installing Node Packages"
npm install --no-progress
print_status "Running Deploy Tasks"
gulp deploy
#sed -i 's/base href="\/"/base href="\/arman\/"/' build/app/html/index.html This is done in gulp>asset:template

print_status "Installing Node Packages for Web Server"
cd build/app/server
npm install --production --no-progress

cd "$WD"
if [ -d "$DEPLOY_PATH" ]; then
  print_status "Stopping Previously Running Containers"
  cd "$DEPLOY_PATH"
  docker-compose stop
  docker-compose down
  cd "$WD"
fi

rm -rf "${DEPLOY_PATH}"
mkdir -p "${DEPLOY_PATH}"
mv ${CLONE_PATH}/build/app "${DEPLOY_PATH}/app"
mv ${CLONE_PATH}/resources/docker/docker-compose.yml "${DEPLOY_PATH}/docker-compose.yml"

print_status "Starting Containers"
cd "$DEPLOY_PATH"
docker-compose up -d --build

print_status "All done"
exit 0