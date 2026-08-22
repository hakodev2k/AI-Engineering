# Skill: Token Accounting Diagnosis

## Purpose
Diagnose whether an agent's context-management counters represent current prompt occupancy, cumulative usage, cache accounting, stale metadata, or an estimator.

## Trigger
Unexpected compaction, repeated compaction, impossible context percentages, rapidly growing token counters during multi-tool loops, or disagreement between UI/session metadata and provider request usage.

## Inputs
Per-call usage records, session metadata, transcript revision, context window, compaction records, serialized prompt when safely available, and `config/accounting-policy.json`.

## Preconditions
Capture evidence before resetting counters or deleting session state.

## Required context
Only token/accounting metadata and enough transcript structure to reproduce size; content may be hashed/redacted when full text is sensitive.

## Allowed tools
Read-only logs/session state, local scripts, provider tokenizer when available, calibrated local estimator, and diff/hash tools.

## Constraints
- MUST distinguish current input occupancy from cumulative billed usage.
- MUST NOT infer occupancy by summing repeated per-call input tokens across a tool loop.
- MUST keep cache-read/write counters separate from prompt occupancy unless provider semantics explicitly define otherwise.
- SHOULD prefer provider current-input usage or exact serialization/tokenization over heuristic estimates.
- MUST preserve evidence before remediation.

## Procedure
1. Record configured context-window capacity and model/provider.
2. Extract each per-call input/output/cache usage value in order.
3. Identify the field currently used to trigger compaction.
4. Determine its semantic construction: last call, sum, estimate, post-compaction snapshot, or unknown.
5. Bind the latest transcript/session revision to the accounting snapshot.
6. Compare trigger value against latest provider input tokens and serialized-prompt estimate/tokenization.
7. Detect run-sum inflation: trigger value approximates the sum of repeated per-call usage rather than current input.
8. Detect stale compaction metadata: transcript revision changed but occupancy revision did not.
9. Detect cache mixing and impossible ratios.
10. Produce a minimal reproduction and classify confidence.
11. Hand findings to implementation and independent verification agents.

## Decision points
- Metric semantic type unknown: block automatic destructive compaction.
- Provider input and exact serialized tokenization disagree beyond provider-specific expectations: escalate before changing thresholds.
- Only heuristic estimate available: attach error tolerance and avoid irreversible context loss near threshold.

## Expected output
Facts, assumptions, metric semantics, evidence table, suspected root cause, reproduction, risk, and proposed invariant.

## Metrics
Reproduction rate, semantic-field coverage, estimator error, false compaction rate, and post-compaction counter consistency.

## Verification
A separate verifier replays fixtures and confirms the corrected metric follows current context rather than cumulative run usage.

## Failure handling
If logs are insufficient, preserve the session, disable automatic compaction for that session if safe, collect the next call's accounting evidence, and retry diagnosis at most once.

## Stop conditions
Stop when the trigger metric has a proven semantic source, the inconsistency is reproducible or ruled out, and a deterministic invariant can distinguish safe from unsafe compaction.