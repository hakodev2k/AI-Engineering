#!/usr/bin/env sh
set -eu
REPO=""
EVIDENCE=""
while [ "$#" -gt 0 ]; do
  case "$1" in
    --repo) REPO=${2:-}; shift 2 ;;
    --evidence) EVIDENCE=${2:-}; shift 2 ;;
    *) echo "unknown argument: $1" >&2; exit 2 ;;
  esac
done
[ -n "$REPO" ] || { echo "--repo is required" >&2; exit 2; }
[ -n "$EVIDENCE" ] || { echo "--evidence is required" >&2; exit 2; }
HERE=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
python3 "$HERE/scripts/validate-config.py" --config "$HERE/config/outbox-gate.json"
SCAN=$(mktemp)
trap 'rm -f "$SCAN"' EXIT
python3 "$HERE/scripts/scan-outbox.py" --repo "$REPO" --config "$HERE/config/outbox-gate.json" --output "$SCAN"
python3 "$HERE/scripts/verify-evidence.py" --evidence "$EVIDENCE" --schema "$HERE/schemas/evidence.schema.json"
echo "outbox gate passed"
