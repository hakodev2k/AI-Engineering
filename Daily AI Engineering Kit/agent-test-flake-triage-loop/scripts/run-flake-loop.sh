#!/usr/bin/env bash
set -uo pipefail

usage() {
  echo "Usage: $0 --attempts N --output-dir DIR -- COMMAND [ARGS...]" >&2
}

ATTEMPTS=""
OUTDIR=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --attempts) ATTEMPTS="${2:-}"; shift 2 ;;
    --output-dir) OUTDIR="${2:-}"; shift 2 ;;
    --) shift; break ;;
    *) usage; exit 2 ;;
  esac
done

if [[ -z "$ATTEMPTS" || ! "$ATTEMPTS" =~ ^[1-9][0-9]*$ || -z "$OUTDIR" || $# -eq 0 ]]; then
  usage
  exit 2
fi

mkdir -p "$OUTDIR" || { echo "Cannot create output directory: $OUTDIR" >&2; exit 3; }
SUMMARY="$OUTDIR/summary.tsv"
printf 'attempt\texit_code\tresult\tlog\n' > "$SUMMARY"

passes=0
fails=0
for ((i=1; i<=ATTEMPTS; i++)); do
  log="$OUTDIR/run-$(printf '%03d' "$i").log"
  echo "[flake-loop] attempt $i/$ATTEMPTS"
  set +e
  "$@" >"$log" 2>&1
  rc=$?
  set -e
  if [[ $rc -eq 0 ]]; then
    result="pass"; ((passes+=1)) || true
  else
    result="fail"; ((fails+=1)) || true
  fi
  printf '%d\t%d\t%s\t%s\n' "$i" "$rc" "$result" "$log" >> "$SUMMARY"
done

cat > "$OUTDIR/result.env" <<EOF
ATTEMPTS=$ATTEMPTS
PASSES=$passes
FAILURES=$fails
INTERMITTENT=$([[ $passes -gt 0 && $fails -gt 0 ]] && echo true || echo false)
EOF

echo "[flake-loop] passes=$passes failures=$fails evidence=$OUTDIR"
# Exit 0 means the loop itself executed successfully; individual test failures are data.
exit 0
