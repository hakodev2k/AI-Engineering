#!/usr/bin/env sh
set -eu
REPO=""; OUTPUT=""
while [ "$#" -gt 0 ]; do
  case "$1" in
    --repo) REPO=${2:-}; shift 2;;
    --output) OUTPUT=${2:-}; shift 2;;
    *) echo "unknown argument: $1" >&2; exit 3;;
  esac
done
[ -n "$REPO" ] || { echo "--repo required" >&2; exit 3; }
[ -n "$OUTPUT" ] || { echo "--output required" >&2; exit 3; }
BASE=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
python3 "$BASE/scripts/validate-config.py" --config "$BASE/config/fixture-contamination.json"
python3 "$BASE/scripts/scan-fixtures.py" --repo "$REPO" --config "$BASE/config/fixture-contamination.json" --output "$OUTPUT"
