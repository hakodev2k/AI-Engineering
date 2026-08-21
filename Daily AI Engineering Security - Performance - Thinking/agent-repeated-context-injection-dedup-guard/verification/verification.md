# Verification

## Status dimensions
Do not collapse these states into one label.

### Implemented
Pass only when:
- `context_injection_guard.py` performs deterministic normalization, fingerprinting, source policy lookup, bounded ledger retention, first/changed inclusion, duplicate suppression, freshness re-inclusion, oversized-event handling, and required-source protection;
- `context_metrics.py` compares baseline and guarded token estimates;
- policy, workflows, hooks, and integration instructions are present;
- regression tests cover the principal safety/correctness boundaries.

### Measured
Pass only when the same immutable event stream has been evaluated before and after enforcement and the report contains:
- baseline tokens;
- guarded tokens;
- suppressed tokens;
- duplicate ratio;
- required-context violations;
- target reduction status.

For production claims, provider token counts should replace or validate the portable character estimator.

### Verified
Pass only when all conditions below hold:
1. required-context violations = 0;
2. first occurrence inclusion = 100%;
3. changed-version inclusion = 100%;
4. exact duplicate suppression precision = 100% on deterministic fixtures;
5. unknown source behavior = include-all;
6. current tool result behavior = include-all;
7. stale/freshness re-inclusion works as configured;
8. ledger growth is bounded;
9. target repeated-token reduction is reached on the selected representative replay, default 30%;
10. quality/golden task regression suite shows no blocking degradation.

## Threats to validity
- Character/token estimates differ across models and serialization formats.
- Synthetic fixtures can overstate duplicate rates compared with real sessions.
- Exact fingerprinting intentionally misses semantic duplicates with wrapper changes.
- A stable logical key that is incorrectly scoped can cause dangerous false suppression.
- Host-generated content may contain hidden protocol metadata not represented in text-only fixtures.

## Required adversarial tests

### Key collision
Two unrelated files/rules must never share one logical key. The integration must surface collisions rather than treat them as versions of the same state.

### Changed content with same version label
Fingerprint content independently of a provided version field; changed content must still include.

### Same content with different logical key
Include both because identity differs.

### Required duplicate
Duplicate safety/authz/user/current-tool content remains included.

### Unknown producer
Include until classified.

### Oversized optional producer
Reject or spill through an explicitly designed retrieval mechanism; do not silently inject uncontrolled size.

### Ledger eviction
After eviction, a later identical event is included again. No permanent suppression may depend on forgotten state.

## Benchmark procedure
1. Capture a long-running representative session.
2. Freeze the event stream.
3. Run baseline inclusion of all events.
4. Run guarded admission with a pinned policy version.
5. Measure tokens with the same tokenizer/provider API.
6. Compare p50/p95 context-build latency.
7. Replay golden tasks.
8. Repeat the benchmark at least three times when latency is part of the claim.

## Failure handling

### Detection
Any failing fixture, nonzero required-context violation, quality regression, unexpected missing context, or token reduction below the agreed threshold.

### Evidence
Store policy version, event IDs/logical keys, fingerprints, decisions, token totals, and failing assertion. Avoid storing suppressed payload content when metadata suffices.

### Retry policy
Maximum two policy/integration remediation attempts.

### Fallback
Set the implicated source to `deduplicate=false` and return to include-all behavior.

### Escalation
Human/release-owner review after two failed attempts, any safety/authz/user-context suppression, or inability to define stable identity semantics.

### Stop condition
Never continue automated optimization by weakening correctness, safety, or required-context coverage.

## Definition of Done
- Evidence documents the real problem and current approaches.
- Baseline is captured.
- Dominant repeat producer is identified.
- Guard is integrated or reference implementation is complete.
- Tests pass.
- Metrics are collected.
- Baseline/guarded comparison is complete.
- Required context is preserved.
- Changed versions are preserved.
- Quality regression gate passes.
- Failure/rollback path is documented.
- No blocking verification issue remains.
