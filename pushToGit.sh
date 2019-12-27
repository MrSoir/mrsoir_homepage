#!/usr/local/env bash

set -e;

git add ./src
git add ./public
git add ./fonts
git add ./InfoHippo.txt
git add ./README.md
git add ./package.json
git add ./publishToFirebase.sh
git add ./pushToGit.sh

git commit -m "bashed commit"

git push -u origin master
