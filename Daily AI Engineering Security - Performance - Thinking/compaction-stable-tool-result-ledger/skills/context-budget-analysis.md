# Skill: Context Budget Analysis

## Purpose
Measure duplicate context projection and identify tool results that should become stable references instead of repeated raw transcript text.

## Trigger
High tokens/task, low prompt-cache reuse, repeated file reads, frequent compaction, or long follow-up latency.

## Inputs
Provider usage, conversation trace, tool outputs, compaction events, current quality baseline.

## Preconditions
Representative task traces and a known context window/budget.

## Required context
Task requirements, tool-result provenance, freshness expectations, and mandatory evidence that cannot be compressed.

## Allowed tools
Read-only metrics queries and `scripts/context_ledger.py`.

## Constraints
MUST NOT remove evidence required for correctness. MUST NOT store plaintext secrets. MUST preserve provenance/freshness metadata.

## Procedure
1. Capture input/output/cache token baseline.
2. Fingerprint tool results and count duplicate raw projections.
3. Identify dedup state lost at compaction boundaries.
4. Measure prompt-prefix instability where observable.
5. Define projection budget and relevance threshold.
6. Ingest safe summaries into the ledger.
7. Project under budget and run quality regressions.
8. Compare tokens, latency, cache behavior, and quality.

## Decision points
Retain raw context when summary/reference is insufficient. Rehydrate from source when freshness is required. Reject secret-bearing persistence.

## Expected output
Facts, token baseline, duplicate groups, projection policy, post-change metrics, quality verification.

## Metrics
Tokens/task, duplicate raw bytes, cache behavior, latency, result quality, regression rate.

## Verification
Independent verifier runs baseline-equivalent tasks and confirms critical evidence remains available.

## Failure handling
Fall back to source-grounded context rather than silently relying on incomplete summaries.

## Stop conditions
Maximum two tuning iterations; stop on correctness regression or missing provenance.
