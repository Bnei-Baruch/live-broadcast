#!/usr/bin/env bash
HOME="~/nom/projects/live-broadcast"
cd $HOME
pwd
npm run build
git add dist/*
git commit -am "production build"
git push origin master