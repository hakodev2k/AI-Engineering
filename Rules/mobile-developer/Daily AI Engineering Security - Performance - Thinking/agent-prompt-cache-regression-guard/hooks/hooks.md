# Hooks

## Hook — Pre-task telemetry validation
**Trigger:** Before benchmark or production cache-health analysis.

**Action:** Validate that required request fields and configured fingerprint fields exist.

**Command:** `python scripts/cache_health.py validate --input telemetry.jsonl --policy config/policy.json`

**Expected result:** Exit `0`; request ordering and numeric usage fields are valid.

**Failure behavior:** Exit non-zero and stop cache-health claims until instrumentation is fixed.

---

## Hook — Post-session cache-health analysis
**Trigger:** After a representative agent session or benchmark run.

**Action:** Calculate cache ratios, reset classification, and latency distribution.

**Command:** `python scripts/cache_health.py analyze --input telemetry.jsonl --policy config/policy.json --output cache-report.json`

**Expected result:** Machine-readable report with eligibility count, ratios, reset records, and gate status.

**Failure behavior:** Preserve raw telemetry; do not silently drop malformed requests or downgrade thresholds.

---

## Hook — Pre-release regression gate
**Trigger:** Before releasing cache-relevant runtime changes.

**Action:** Compare verified baseline and candidate reports.

**Command:** `python scripts/compare_cache_runs.py --baseline baseline.json --candidate candidate.json --policy config/policy.json`

**Expected result:** Exit `0` only when candidate passes cache and latency thresholds.

**Failure behavior:** Block the cache-performance gate; require explicit investigation rather than repeated reruns until green.

---

## Hook — Known invalidator recorder
**Trigger:** Model switch, MCP connect/disconnect, compaction, client upgrade, context truncation, explicit cache-key change.

**Action:** Emit an event into the same ordered telemetry stream with `type=invalidator`, `kind=<configured kind>`, timestamp and current request sequence.

**Command/script:** Runtime adapter writes one JSON object; analyzer consumes it directly.

**Expected result:** Cache reset within `known_invalidator_window_requests` can be classified as explained.

**Failure behavior:** Missing event means analyzer must not assume an expected invalidation occurred.
