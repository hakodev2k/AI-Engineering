#!/usr/bin/env bash
set -euo pipefail

if [ ! -d .git ]; then
  echo "Not a git repository"
  exit 1
fi

git diff --check

echo "Repository validation passed"
