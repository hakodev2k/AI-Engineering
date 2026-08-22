# Core Skills

## Skill 1 — Establish Prompt-Cache Baseline

**Purpose:** Capture provider-neutral cache and latency behavior before optimization or regression claims.

**Trigger:** New agent runtime, model/provider upgrade, MCP/tool change, cache-policy change, or unexplained quota/cost growth.

**Inputs:** Request telemetry JSONL, policy file, representative workload/run label.

**Preconditions:** Usage telemetry contains input tokens and, when provider supports it, cached/cache-created tokens. Request ordering is preserved.

**Required context:** Provider, model, cache-relevant configuration fingerprint, known invalidator events, latency.

**Tools:** `scripts/cache_health.py`, benchmark runner, provider usage logs.

**Procedure:**
1. Freeze a representative workload and runtime configuration.
2. Record one event per request using the schema documented in README.
3. Run at least `minimum_requests_for_gate` eligible requests.
4. Execute `python scripts/cache_health.py analyze --input <jsonl> --policy config/policy.json`.
5. Record token-weighted cache-read ratio, cache-creation amplification, reset count, attribution, p50/p95 latency.
6. Save the report as the baseline artifact.
7. Repeat once if environmental noise is suspected; do not average away unexplained resets without documenting them.

**Decisions:** If cache metrics are unavailable, mark that provider/run as `not_observable` rather than inventing estimates. If the baseline itself fails thresholds, treat it as investigation evidence, not a passing reference.

**Constraints:** Never infer cache health from total input tokens alone. Never compare different workloads without labeling the comparison.

**Expected output:** Machine-readable health report plus a baseline label.

**Metrics:** Cache-read ratio, creation amplification, unexplained resets/100 requests, p50/p95 latency.

**Verification:** Re-running analyzer on the same log produces identical results.

**Failure handling:** Malformed or missing required fields fail with non-zero exit. Insufficient eligible requests yields an explicit insufficient-data state.

**Stop conditions:** Baseline is reproducible and contains enough requests, or observability is proven insufficient and escalated.

---

## Skill 2 — Attribute a Cache Regression

**Purpose:** Separate expected invalidations from suspicious cache loss without claiming unsupported root cause.

**Trigger:** Cache-read ratio drops, cache-create spike occurs, or latency/quota rises while workload remains stable.

**Inputs:** Telemetry around anomaly, fingerprint fields, known invalidator events, baseline.

**Preconditions:** Request timestamps/order and cache usage are available.

**Procedure:**
1. Identify the first request where cache read collapses relative to the preceding stable window.
2. Compare stable fingerprint fields before and after the reset.
3. Search the configured attribution window for a known invalidator.
4. If fingerprint changed, report exact changed fields.
5. If a known invalidator occurred, classify reset as `explained` while still measuring its cost/latency impact.
6. If neither occurred, classify as `unexplained`; do not label it provider-side unless external evidence supports that claim.
7. Measure recovery: requests until prior cache-read ratio is restored.
8. Correlate with latency and cache creation; produce an evidence table.

**Decisions:** Multiple simultaneous changes are `multi-cause-candidate`, not a forced single cause.

**Constraints:** No hidden reasoning is requested. Output only observed facts, candidate causes, confidence labels, and verification status.

**Expected output:** Regression incident with `Observed`, `Changed fields`, `Known invalidator`, `Classification`, `Impact`, `Next test`.

**Metrics:** Attribution coverage, unexplained reset rate, recovery length.

**Verification:** A reviewer can recompute classification from telemetry and policy.

**Failure handling:** Missing pre/post fingerprints prevents attribution and must be marked incomplete.

**Stop conditions:** Reset is explained, or bounded investigation reaches two controlled experiments without evidence and escalates.

---

## Skill 3 — Verify a Cache Optimization

**Purpose:** Prove a cache-oriented change improves performance without reducing task correctness.

**Trigger:** Prompt ordering, tool topology, cache key, retention, compaction, or session lifecycle is changed to improve caching.

**Inputs:** Frozen workload, baseline report, candidate report, correctness/test result.

**Procedure:**
1. Keep workload, model and required tools constant unless the change explicitly targets one of them.
2. Run baseline and candidate with fresh run labels.
3. Compare via `compare_cache_runs.py`.
4. Require no correctness/test regression.
5. Require cache-read ratio not to regress and targeted cache metric to meet threshold.
6. Check p95 latency threshold.
7. Inspect unexplained resets; a better average cannot hide new unexplained reset behavior.
8. Mark separately: Implemented, Measured, Verified.

**Expected output:** Pass/fail comparison with metric deltas and evidence paths.

**Metrics:** Cache-read ratio delta, creation-amplification delta, p95 delta, unexplained reset delta, task success.

**Verification:** Independent verification agent reruns comparison from raw reports.

**Failure handling:** Maximum two retries for environmental instability; then stop and report inconclusive.

**Stop conditions:** Verified pass, verified regression, or bounded inconclusive result.
