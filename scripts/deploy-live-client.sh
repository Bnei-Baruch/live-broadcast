#!/usr/bin/env bash
#
echo "-----> Deploying live broadcast client" && (
  cd /home/ruby1/live-broadcast/ &&
  echo "pulling changes from git" &&
  git pull &&
  echo "Cleaning public directory" &&
  rm -rf /sites/kab.tv/live/* &&
  echo "Copying new files to public directory" &&
  cp -r ./dist/* /sites/kab.tv/live &&
  echo "" &&
  echo "-----> Done."
) || (
  echo "! ERROR: Deployment failed."
)
