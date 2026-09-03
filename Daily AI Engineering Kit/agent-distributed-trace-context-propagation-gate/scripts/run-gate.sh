#!/usr/bin/env sh
set -eu
REPO=""; EVIDENCE=""; CONFIG="config/trace-gate.json"; SCAN_OUT="${TMPDIR:-/tmp}/trace-propagation-scan.json"
while [ "$#" -gt 0 ]; do
  case "$1" in
    --repo) REPO=${2:-}; shift 2 ;;
    --evidence) EVIDENCE=${2:-}; shift 2 ;;
    --config) CONFIG=${2:-}; shift 2 ;;
    --scan-output) SCAN_OUT=${2:-}; shift 2 ;;
    *) echo "unknown argument: $1" >&2; exit 2 ;;
  esac
done
[ -n "$REPO" ] || { echo "--repo is required" >&2; exit 2; }
python3 scripts/validate-config.py --config "$CONFIG"
scan_rc=0
python3 scripts/scan-trace-propagation.py --repo "$REPO" --config "$CONFIG" --output "$SCAN_OUT" || scan_rc=$?
if [ -n "$EVIDENCE" ]; then python3 scripts/verify-evidence.py --evidence "$EVIDENCE" --schema schemas/evidence.schema.json; fi
if [ "$scan_rc" -ne 0 ]; then echo "trace propagation gate blocked; inspect $SCAN_OUT" >&2; exit "$scan_rc"; fi
echo "trace propagation deterministic gate passed"
