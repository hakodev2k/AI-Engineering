# Workflow: Reconstruct and Verify Context Accounting

## Trigger
Unexpected compaction, occupancy jump, model/provider upgrade, or advisor/multi-iteration rollout.

## Goal
Use evidence to distinguish actual final context from cumulative usage and correct only proven inflation.

## Inputs
Trace dataset, runtime/model/transport metadata, window and threshold.

## Baseline
Current runtime's compaction decisions and top-level usage values replayed unchanged.

## Stages
1. **Observe** — collect immutable telemetry and version metadata.
2. **Measure baseline** — replay current compaction decisions.
3. **Diagnose** — classify top-level, iteration, cache, reasoning and local-addition fields.
4. **Form hypothesis** — one of: iteration rollup inflation, reasoning double count, missing provider detail, or true context pressure.
5. **Implement improvement** — normalize occupancy separately from billing work.
6. **Measure again** — replay the same dataset.
7. **Improved?** If no, re-evaluate with at most two alternative mappings. If yes, continue.
8. **Verify** — independent verifier checks genuine threshold crossings and quality/context retention.

## Responsible agent
Context-accounting investigator implements; Accounting Verifier validates.

## Tools
`usage_accounting_guard.py`, runtime source/docs, tokenizer if available, unit tests.

## Outputs
Old/new replay, changed decisions, inflation ratios, confidence and verification status.

## Checkpoints
Raw evidence frozen; mapping documented; before behavior change; after replay; final independent verification.

## Metrics
Premature compactions, missed true compactions, tokens/task, compactions/task, cache hit rate, latency/cost, quality regression.

## Retry policy
Maximum two alternative schema/accounting mappings after the initial hypothesis.

## Stop conditions
Any missed genuine overflow, ambiguous provenance after retries, or successful independent verification.

## Failure path
Retain conservative compaction behavior, surface ambiguity, escalate to provider/runtime owner. Never disable safety/context limits to reduce token use.

## Definition of Done
Implemented, Measured and Verified are explicit; no true overflow is missed; changed decisions are evidence-backed; no critical context-loss regression remains.