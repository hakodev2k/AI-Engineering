#!/usr/bin/env bash
set -euo pipefail

if [ ! -d .git ]; then
  echo "Not a git repository"
  exit 1
fi

if [ -f package.json ]; then
  echo "Detected Node project"
fi

if [ -f *.sln ]; then
  echo "Detected .NET solution"
fi

git diff --stat
exit 0
