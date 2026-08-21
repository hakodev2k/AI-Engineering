#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

python3 "$ROOT/scripts/validate-report.py" "$ROOT/examples/sample-report.json"
printf 'Authorization: Bearer abc123\npassword=hunter2\nnormal=value\n' > "$TMP/raw.log"
python3 "$ROOT/scripts/redact-evidence.py" "$TMP/raw.log" "$TMP/redacted.log"
if grep -Eq 'abc123|hunter2' "$TMP/redacted.log"; then
  echo 'redaction self-test failed' >&2
  exit 1
fi
if ! grep -q '\[REDACTED\]' "$TMP/redacted.log"; then
  echo 'redaction marker missing' >&2
  exit 1
fi
echo 'self-test passed'
