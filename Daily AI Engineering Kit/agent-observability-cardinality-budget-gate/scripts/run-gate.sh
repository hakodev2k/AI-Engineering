#!/usr/bin/env sh
set -eu
REPO=""; SAMPLE=""; EVIDENCE=""
HERE=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
usage(){ echo "usage: $0 --repo PATH [--sample FILE] [--evidence FILE]" >&2; exit 3; }
while [ "$#" -gt 0 ]; do
  case "$1" in
    --repo) [ "$#" -ge 2 ] || usage; REPO=$2; shift 2 ;;
    --sample) [ "$#" -ge 2 ] || usage; SAMPLE=$2; shift 2 ;;
    --evidence) [ "$#" -ge 2 ] || usage; EVIDENCE=$2; shift 2 ;;
    *) usage ;;
  esac
done
[ -n "$REPO" ] || usage
[ -d "$REPO" ] || { echo "repository not found: $REPO" >&2; exit 3; }
TMP=${TMPDIR:-/tmp}; SCAN="$TMP/cardinality-scan.$$.json"; SAMPLE_OUT="$TMP/cardinality-sample.$$.json"
trap 'rm -f "$SCAN" "$SAMPLE_OUT"' EXIT INT TERM
python3 -m json.tool "$HERE/config/cardinality-policy.json" >/dev/null
python3 "$HERE/scripts/scan-cardinality.py" --repo "$REPO" --config "$HERE/config/cardinality-policy.json" --output "$SCAN"
if [ -n "$SAMPLE" ]; then
  [ -f "$SAMPLE" ] || { echo "sample not found: $SAMPLE" >&2; exit 3; }
  python3 "$HERE/scripts/analyze-sample.py" --input "$SAMPLE" --config "$HERE/config/cardinality-policy.json" --output "$SAMPLE_OUT"
fi
if [ -n "$EVIDENCE" ]; then
  [ -f "$EVIDENCE" ] || { echo "evidence not found: $EVIDENCE" >&2; exit 3; }
  python3 "$HERE/scripts/verify-evidence.py" --evidence "$EVIDENCE"
fi
echo "cardinality gate passed"
