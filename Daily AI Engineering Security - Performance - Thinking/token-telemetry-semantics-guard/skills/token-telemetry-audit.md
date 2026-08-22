# Skill — Token Telemetry Audit

## Purpose
Verify that token counters used for context management, cost analysis, and UI display have explicit semantics and trustworthy provenance.

## Trigger
A new model/provider integration, compaction bug, unexplained usage spike, context-pressure alert, or change to token accounting fields.

## Inputs
Token-event JSONL, context-window size, provider usage fields, local estimates, cached-token counts, and `config/policy.json`.

## Preconditions
At least one token event is available and the consuming decision can be identified (display, billing, compaction, routing, or alerting).

## Required context
Definitions for every token field, which values are provider-measured versus local estimates, and whether counters are per-turn or cumulative.

## Allowed tools
Read-only logs, local Python validation, tokenizer/provider metadata, benchmark fixtures, and aggregation tools.

## Constraints
- MUST NOT infer current context occupancy from a cumulative session counter.
- MUST NOT replace a measured value with an estimate.
- MUST preserve measurement source.
- SHOULD compare estimates with measured values on multilingual/non-ASCII fixtures.

## Procedure
1. Inventory every token counter and its consumer.
2. Classify semantics: current context, current output, cached input, cumulative session, or estimate.
3. Record measurement source for each counter.
4. Normalize events to the package schema.
5. Run `scripts/token_telemetry_guard.py`.
6. Inspect context-window violations and cumulative monotonicity.
7. Where measured and estimated current-context counts coexist, compute relative estimator error.
8. Reproduce compaction decisions using only canonical current-context fields.
9. Compare before/after decision accuracy and alert quality.
10. Hand results to an independent verifier.

## Decision points
- Ambiguous token field consumed by automation: block automation until mapped.
- Current context > model window: flag inconsistency and block context decision.
- Estimated value available but measured value exists: retain both; measured value wins for decision-making.
- Estimator error above policy threshold: disable estimator for automated thresholds or replace it with a validated tokenizer.

## Expected output
A normalized telemetry report, semantic violations, estimator-error statistics, and decision-safety status.

## Metrics
Semantic coverage, provenance coverage, estimator error, false compaction/alert rate, tokens/task, cached ratio, and current-context utilization.

## Verification
Replay representative events including post-compaction and non-ASCII samples and confirm expected decisions from `tests/cases.json`.

## Failure handling
On missing semantics or provenance, mark the metric unsafe for automation. Preserve raw values for diagnosis without silently coercing them.

## Stop conditions
Stop after the telemetry contract is complete and replay tests pass, or after 3 measured correction attempts. Escalate unresolved provider-field ambiguity.
