# Skill: Context Budget Analysis

## Purpose
Determine whether automatic compaction is justified using a current-context snapshot rather than cumulative usage.

## Trigger
Before automatic compaction, after anomalous token growth, or when a session compacts unusually early.

## Inputs
Context-window size, snapshot token count, snapshot provenance, cumulative usage, last-call input/output/cache usage, critical-state ledger.

## Preconditions
The runtime exposes at least one measurable token counter and configured context-window size.

## Required context
Current task goal, constraints, decisions and verification state; no hidden chain-of-thought is requested.

## Allowed tools
Read-only logs, provider usage metadata, tokenizer/counter utilities, deterministic guard.

## Constraints
- MUST NOT use cumulative usage alone as a compaction trigger.
- MUST NOT discard critical task/security context to meet a token target.
- MUST distinguish measured snapshot values from estimates.

## Procedure
1. Inventory every token counter and label its semantics/provenance.
2. Establish baseline context utilization before compaction.
3. Compare snapshot value with last-call input/cache evidence.
4. Run `scripts/compaction_guard.py`.
5. If compaction is allowed, snapshot critical state before summarization.
6. Measure post-compaction tokens and critical-state retention.
7. Continue only if retention is complete and utilization decreased materially.

## Decision points
`allow_compaction`, `block_bad_provenance`, `block_below_threshold`, `block_inconsistent_snapshot`, `block_state_loss`.

## Expected output
Facts, counter provenance, utilization, decision, reasons, before/after metrics, verification status.

## Metrics
Tokens/task, compaction frequency, utilization at trigger, retained-state coverage, latency/task, cost/task, post-compaction regression rate.

## Verification
Independent reviewer checks the trigger source and critical-state retention.

## Failure handling
Maximum 2 remeasurements. Unknown provenance fails closed for automatic compaction.

## Stop conditions
Stop on missing snapshot provenance, state-retention failure, or two inconsistent measurements.
