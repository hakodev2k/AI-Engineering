# Lifecycle Hooks

## Pre-task repository validation
**Trigger:** before investigation/editing. **Preconditions:** package intact and repository path supplied. **Action:** validate policy JSON and package tests. **Command:** `python3 -m json.tool config/cardinality-policy.json >/dev/null && python3 -m unittest tests/test-gate.py`. **Expected:** exit 0. **Failure:** preserve output and stop before edits. **Blocking:** yes.

## Post-edit cardinality scan
**Trigger:** after telemetry-producing code edits. **Preconditions:** repository path known. **Action:** run `python3 scripts/scan-cardinality.py --repo "$REPO_ROOT" --config config/cardinality-policy.json --output "$SCAN_OUTPUT"`. **Expected:** no blocking findings. **Failure:** return findings to Implementation Agent; do not auto-edit from regex evidence alone. **Blocking:** yes when policy threshold is exceeded.

## Post-edit sample analysis
**Trigger:** after telemetry edit when representative JSONL sample exists. **Preconditions:** one JSON object per line, attributes top-level or under `attributes`. **Action:** run `python3 scripts/analyze-sample.py --input "$TELEMETRY_SAMPLE" --config config/cardinality-policy.json --output "$SAMPLE_OUTPUT"`. **Expected:** no threshold breaches. **Failure:** preserve report and investigate offending dimension source. **Blocking:** yes unless an explicit approved exception exists.

## Final evidence verification
**Trigger:** before claiming completion. **Preconditions:** evidence JSON produced and independently reviewed. **Action:** run `python3 scripts/verify-evidence.py --evidence "$EVIDENCE_FILE"`. **Expected:** exit 0 and `verification_status=verified`. **Failure:** completion blocked; return to owning stage within retry budget. **Blocking:** yes.
