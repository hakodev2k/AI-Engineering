#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
required=(
  "README.md"
  "config/flake-triage.yaml"
  "rules/test-flake-safety.md"
  "skills/reproduce-and-classify.md"
  "skills/minimize-and-fix.md"
  "subagents/flake-investigator.md"
  "subagents/verification-agent.md"
  "workflows/test-flake-triage.md"
  "hooks/pre-task.md"
  "hooks/post-change.md"
  "scripts/run-flake-loop.sh"
  "scripts/inspect-test-history.py"
  "schemas/investigation-handoff.schema.json"
  "templates/triage-report.md"
)

for file in "${required[@]}"; do
  [[ -s "$ROOT/$file" ]] || { echo "missing or empty: $file" >&2; exit 1; }
done

python3 -m json.tool "$ROOT/schemas/investigation-handoff.schema.json" >/dev/null
python3 -m py_compile "$ROOT/scripts/inspect-test-history.py"
bash -n "$ROOT/scripts/run-flake-loop.sh"

for ref in \
  "config/flake-triage.yaml" \
  "rules/test-flake-safety.md" \
  "scripts/run-flake-loop.sh" \
  "scripts/inspect-test-history.py" \
  "subagents/verification-agent.md" \
  "templates/triage-report.md"; do
  grep -R -F "$ref" "$ROOT" >/dev/null || { echo "unreferenced required artifact: $ref" >&2; exit 1; }
done

if grep -R -n -E 'implementation omitted|remaining files omitted|same as above|add logic here|continue similarly|other files omitted for brevity' "$ROOT" --exclude-dir=.git; then
  echo "forbidden omission marker found" >&2
  exit 1
fi

echo "package verification passed"
