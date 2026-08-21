#!/usr/bin/env bash
set -euo pipefail

OUT=${1:-incident-context.txt}
{
  echo "Incident context collection"
  date -u
  echo "Host: $(hostname 2>/dev/null || echo unavailable)"
  echo "User: $(whoami 2>/dev/null || echo unavailable)"
  echo "Git: $(git rev-parse --short HEAD 2>/dev/null || echo unavailable)"
} > "$OUT"

echo "Created $OUT"
