#!/usr/local/env bash

set -e;

yarn run build
firebase deploy
