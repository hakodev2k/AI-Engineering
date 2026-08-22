#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

python3 "$ROOT/scripts/validate-assessment.py" "$ROOT/examples/sample-assessment.json"

mkdir -p "$TMP/repo"
cat > "$TMP/repo/Safe.cs" <<'EOF'
public class Safe {
    public async Task Update(CancellationToken ct) {
        await db.SaveChangesAsync(ct);
        await cache.RemoveAsync("customer:1", ct);
    }
}
EOF
python3 "$ROOT/scripts/scan-cache-risk.py" "$TMP/repo" --json > "$TMP/safe.json"

cat > "$TMP/repo/Risky.cs" <<'EOF'
public class Risky {
    public void Reset() {
        cache.Clear();
    }
}
EOF
set +e
python3 "$ROOT/scripts/scan-cache-risk.py" "$TMP/repo" --json > "$TMP/risky.json"
code=$?
set -e
if [[ "$code" -ne 1 ]]; then
  echo "expected scanner exit code 1 for high-risk broad flush, got $code" >&2
  exit 1
fi

grep -q '"risk": "high"' "$TMP/risky.json"
echo "self-test: PASS"
