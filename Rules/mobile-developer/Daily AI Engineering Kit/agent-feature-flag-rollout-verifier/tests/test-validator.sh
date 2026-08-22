#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

python scripts/validate-rollout.py \
  --contract examples/sample-rollout.json \
  --policy config/rollout-policy.yaml

TMP="$(mktemp)"
trap 'rm -f "$TMP"' EXIT
python - <<'PY' > "$TMP"
import json
p='examples/sample-rollout.json'
d=json.load(open(p, encoding='utf-8'))
d['stages'][0]['percent']=50
print(json.dumps(d))
PY

if python scripts/validate-rollout.py --contract "$TMP" --policy config/rollout-policy.yaml; then
  echo "ERROR: validator accepted an unsafe initial rollout" >&2
  exit 1
fi

echo "PASS: validator accepts valid contract and rejects unsafe contract"
