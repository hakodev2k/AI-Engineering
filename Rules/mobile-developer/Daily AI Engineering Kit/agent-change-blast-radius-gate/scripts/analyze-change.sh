#!/usr/bin/env bash
set -e

base=${1:-HEAD~1}

git diff --stat "$base" HEAD
git diff --name-only "$base" HEAD
