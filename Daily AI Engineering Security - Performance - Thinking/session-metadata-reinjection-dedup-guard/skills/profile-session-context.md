# Skill: Profile Session Context

## Purpose
Measure which persisted session records actually dominate a reconstructed agent prompt and identify safe deduplication/supersession opportunities.

## Trigger
Use when session cost/latency rises over time, compaction repeats, provider usage diverges from visible conversation size, or history reconstruction changes.

## Inputs
Session JSONL, `config/budget.json`, optional provider token telemetry, and representative quality/regression tasks.

## Preconditions
- Work from a copy of the session log.
- Do not modify production session state during profiling.
- Event `type`/`subtype` fields or an equivalent classification must be available.

## Required context
Session records, inclusion policy, protected state definition, and only the quality fixtures necessary to detect regressions.

## Allowed tools
Read-only session analysis, `scripts/session_bloat_profiler.py`, tokenizer/provider usage telemetry, and deterministic regression tests.

## Constraints
Never delete protected state merely to reduce tokens. Treat unknown event types as protected until reviewed.

## Procedure
1. Capture baseline file bytes, record count, event-class distribution, and provider prompt tokens if available.
2. Run the profiler to compute duplicate fingerprints, duplicate bytes, and per-type replay cost.
3. Classify event types as protected, superseding, ephemeral, or unknown.
4. For superseding records, define the identity key and retain the latest semantically required record.
5. For ephemeral records, define the turn/time/task lifetime required for correctness.
6. Build a candidate replay working set without mutating the original log.
7. Estimate before/after bytes and tokens.
8. Replay representative tasks or run deterministic quality fixtures.
9. Compare provider telemetry where possible.
10. Accept only if protected retention and quality thresholds pass.

## Decision points
- Unknown type: protect and request review.
- Duplicate protected type: report but do not remove automatically.
- Duplicate transient type: candidate for canonicalization.
- Superseding type: retain latest by stable key if semantics are proven.
- Savings without quality evidence: not verified.

## Expected output
Baseline metrics, duplicate groups, per-type cost, candidate working-set savings, protected-retention evidence, quality result, and acceptance/rejection decision.

## Metrics
Bytes/type, estimated tokens/type, duplicate ratio, candidate savings, prompt tokens/task, first-token latency where available, quality pass rate, protected retention rate.

## Verification
Independent verifier confirms the working set retains all protected records and representative task results remain equivalent or better.

## Failure handling
If event semantics are uncertain, classify them as protected. If profiling data is malformed, stop with evidence rather than guessing.

## Stop conditions
Maximum two optimization cycles. Stop immediately if a required permission, user instruction, safety decision, or recovery checkpoint is lost.
