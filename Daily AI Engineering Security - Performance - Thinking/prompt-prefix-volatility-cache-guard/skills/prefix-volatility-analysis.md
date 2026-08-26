# Skill: Prefix Volatility Analysis

## Purpose
Measure which prompt segment first changes between comparable requests and quantify how much downstream cacheable context is invalidated.

## Trigger
Unexpected cache writes, declining cache-hit ratio, rising long-context cost, new dynamic system/hook/subagent metadata, or prompt-builder changes.

## Inputs
Two ordered prompt-segment manifests containing stable IDs, content hashes or content, token estimates, and `required`/`stability` metadata.

## Preconditions
Requests must be comparable enough for a cache-reuse expectation. Token estimates must use the same method across baseline and candidate.

## Required context
Provider cache semantics, prompt assembly order, quality/correctness acceptance tests.

## Allowed tools
Trace inspection, deterministic diffing, tokenizer/usage telemetry, benchmark tests.

## Constraints
MUST NOT delete correctness-critical context solely to save tokens. MUST separate observed cache evidence from predicted blast radius.

## Procedure
1. Capture a baseline prompt manifest and actual cache read/write metrics.
2. Capture a candidate manifest for a comparable request.
3. Diff segments in order and locate the first changed stable ID/content.
4. Sum tokens from that point to the end of the cacheable prefix.
5. Classify the change source: session metadata, date/cwd, hook output, tool schema, policy, retrieved context, or history.
6. Hypothesize a safer placement/isolation mechanism.
7. Change one variable.
8. Measure cache metrics and correctness again.

## Decision points
If blast-radius tokens exceed budget, fail the pre-build check unless the change is marked required and explicitly exempted. Required exemptions must still be measured.

## Expected output
First changed segment, change category, blast-radius tokens, budget status, recommended action, actual before/after cache metrics when available.

## Metrics
Cache-read tokens, cache-creation tokens, blast radius, hit ratio, latency, cost/task, quality regression rate.

## Verification
Independent verifier checks segment ordering, correctness tests, and actual cache metrics on representative runs.

## Failure handling
Missing/ambiguous manifests produce `insufficient_evidence`; no optimization claim is allowed.

## Stop conditions
Maximum two relocation/isolation experiments per issue before escalating for prompt-architecture review.
