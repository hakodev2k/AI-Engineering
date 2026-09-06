#!/usr/bin/env bash
set -euo pipefail

FLAG="${FLAG:?Set FLAG to the feature flag key}"
ROOT="${ROOT:-.}"
REGISTRY="${REGISTRY:-examples/flag-registry.json}"
POLICY="${POLICY:-config/flag-policy.json}"
OUT_DIR="${OUT_DIR:-.flag-cleanup}"

command -v python >/dev/null 2>&1 || { echo "python is required" >&2; exit 3; }
mkdir -p "$OUT_DIR"

python scripts/flag_cleanup_gate.py scan \
  --flag "$FLAG" \
  --root "$ROOT" \
  --registry "$REGISTRY" \
  --policy "$POLICY" \
  --out "$OUT_DIR/scan.json"

python scripts/flag_cleanup_gate.py verify \
  --flag "$FLAG" \
  --registry "$REGISTRY" \
  --policy "$POLICY" \
  --scan "$OUT_DIR/scan.json" \
  --out "$OUT_DIR/verification.json"

echo "verified feature flag cleanup: $FLAG"
