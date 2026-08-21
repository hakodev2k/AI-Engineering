#!/usr/bin/env bash
set -euo pipefail

if [ ! -d .git ]; then
  echo "Not a git repository"
  exit 1
fi

if ! git diff --check; then
  echo "Whitespace or diff validation failed"
  exit 2
fi

echo "Repository validation passed"
