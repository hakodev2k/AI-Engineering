#!/usr/bin/env bash
set -euo pipefail

FLAG="${FLAG:?Set FLAG to the feature flag key}"
ROOT="${ROOT:?Set ROOT to the target repository root}"
REGISTRY="${REGISTRY:?Set REGISTRY to the flag registry JSON path}"
POLICY="${POLICY:-config/flag-policy.json}"
OUT_DIR="${OUT_DIR:-.flag-cleanup}"

command -v python >/dev/null 2>&1 || { echo "python is required" >&2; exit 3; }
[[ -d "$ROOT" ]] || { echo "repository root not found: $ROOT" >&2; exit 3; }
[[ -f "$REGISTRY" ]] || { echo "registry not found: $REGISTRY" >&2; exit 3; }
[[ -f "$POLICY" ]] || { echo "policy not found: $POLICY" >&2; exit 3; }
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
