#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-.}"

if [ ! -d "$ROOT" ]; then
  echo "Repository path not found: $ROOT"
  exit 1
fi

find "$ROOT" -maxdepth 2 -type d | head -50

echo "Context validation completed"
