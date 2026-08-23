# Skill: Context Snapshot Audit

## Purpose
Diagnose premature or repeated compaction by proving which token quantity actually drives the decision.

## Trigger
Compaction below expected utilization, context meter spikes, repeated compaction, or disagreement between provider request usage and session metadata.

## Inputs
Session metadata, per-call usage records, compaction logs, context-window config, provider cache metrics.

## Preconditions
Preserve raw logs; redact secrets; do not compact or mutate the session during baseline capture.

## Required context
At least one complete turn containing all model calls and one compaction decision.

## Allowed tools
Log parsing, JSON inspection, provider usage records, deterministic scripts. No destructive session edits.

## Constraints
Never infer occupancy from a cumulative counter. Never treat cache reads/writes as context occupancy without provider-specific proof.

## Procedure
1. Capture the real last-call prompt tokens and configured window.
2. Capture run-level cumulative input/output/cache totals separately.
3. Record the exact value and field consumed by the compaction threshold.
4. Compare decision value with last-call occupancy and stored transcript estimate.
5. Classify provenance: `last_call`, `recomputed_context`, `run_accumulator`, `cache_accounting`, `unknown`.
6. Reproduce with a multi-call fixture where cumulative usage exceeds the window but each current prompt remains below threshold.
7. Apply the guard at the consumer boundary.
8. Repeat baseline with identical fixture.

## Decision points
If provenance is unknown or stale, block automatic compaction and recompute. If a trusted snapshot exceeds threshold, allow compaction.

## Expected output
Evidence table with current occupancy, decision value, source, freshness, divergence ratio, and decision.

## Metrics
False-compaction rate and divergence ratio `decision_tokens/current_prompt_tokens`.

## Verification
Independent verifier confirms the threshold never consumes `run_total_tokens`.

## Failure handling
At most two recomputation attempts, then stop and require operator review.

## Stop conditions
Stop when source is proven and regression fixture passes, or when required per-call telemetry is unavailable.