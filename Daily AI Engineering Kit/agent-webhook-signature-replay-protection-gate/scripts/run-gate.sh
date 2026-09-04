#!/usr/bin/env sh
set -eu

REPO=""
OUT=""
while [ "$#" -gt 0 ]; do
  case "$1" in
    --repo) REPO=${2:-}; shift 2 ;;
    --output-dir) OUT=${2:-}; shift 2 ;;
    *) echo "unknown argument: $1" >&2; exit 64 ;;
  esac
done

[ -n "$REPO" ] || { echo "--repo is required" >&2; exit 64; }
[ -n "$OUT" ] || { echo "--output-dir is required" >&2; exit 64; }
[ -d "$REPO" ] || { echo "repository directory does not exist: $REPO" >&2; exit 66; }

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
mkdir -p "$OUT"

python3 "$SCRIPT_DIR/scan-webhook-security.py" \
  --repo "$REPO" \
  --config "$ROOT/config/gate.json" \
  --output "$OUT/scan.json"

python3 -m unittest "$ROOT/tests/test-scripts.py"
printf '%s\n' "deterministic gate passed; inspect $OUT/scan.json and run host repository tests"
