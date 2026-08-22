#!/usr/bin/env bash
set -euo pipefail

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Not a git repository"
  exit 1
fi

if [ -f package.json ]; then
  echo "Detected Node project"
fi

if find . -maxdepth 1 -type f -name '*.sln' -print -quit | grep -q .; then
  echo "Detected .NET solution"
fi

git diff --stat
exit 0
