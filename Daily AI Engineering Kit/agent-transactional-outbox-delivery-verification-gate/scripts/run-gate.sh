#!/usr/bin/env sh
set -eu

REPO=""
EVIDENCE=""
while [ "$#" -gt 0 ]; do
  case "$1" in
    --repo) REPO="$2"; shift 2 ;;
    --evidence) EVIDENCE="$2"; shift 2 ;;
    *) echo "unknown argument: $1" >&2; exit 2 ;;
  esac
done

if [ -z "$REPO" ] || [ -z "$EVIDENCE" ]; then
  echo "usage: ./scripts/run-gate.sh --repo /path/to/repository --evidence /path/to/evidence.json" >&2
  exit 2
fi

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
BASE_DIR=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
SCAN_OUT=$(mktemp)
trap 'rm -f "$SCAN_OUT"' EXIT

python3 "$SCRIPT_DIR/scan-outbox-risk.py" --repo "$REPO" --config "$BASE_DIR/config/outbox-gate.json" --output "$SCAN_OUT"
python3 "$SCRIPT_DIR/verify-evidence.py" --evidence "$EVIDENCE"

echo "gate checks completed"
echo "scanner output: $SCAN_OUT (temporary; copy it before process exit if it is required as evidence)"
