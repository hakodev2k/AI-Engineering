#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-.}"

if [ ! -d "$ROOT" ]; then
  echo "Repository path does not exist: $ROOT"
  exit 1
fi

required=(".git")
for item in "${required[@]}"; do
  if [ ! -e "$ROOT/$item" ]; then
    echo "Missing required repository marker: $item"
    exit 2
  fi
done

echo "Context validation passed"
