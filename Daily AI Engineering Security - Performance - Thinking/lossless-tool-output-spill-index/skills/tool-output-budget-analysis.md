# Skill: Tool Output Budget Analysis

## Purpose
Identify where large tool results become expensive or lossy, then establish a measurable spill-before-reduction contract.

## Trigger
Context-limit failures, repeated tool re-runs, oversized shell/search/API results, silent truncation, or rising tokens/task.

## Inputs
Representative tool traces, raw output sizes, current truncation/persistence thresholds, context limits, retry counts, latency, and task-quality outcomes.

## Preconditions
A reproducible task set and permission to inspect non-secret telemetry.

## Required context
Tool name, output size, ordering of reduction/persistence layers, retrieval semantics, and model-context budget.

## Allowed tools
Read-only trace inspection, local test fixtures, deterministic scripts, token counters.

## Constraints
- MUST preserve correctness-critical evidence.
- MUST NOT log secrets to benchmark artifacts.
- MUST compare before/after results on the same task set.

## Procedure
1. Measure p50/p95/max tool-output bytes and input tokens/task.
2. Map every cap, compaction, persistence, serialization, and retrieval stage in execution order.
3. Find the earliest destructive stage.
4. Test whether full bytes can be recovered without re-running the tool.
5. Record current re-run rate and evidence-recovery failures.
6. Form a hypothesis linking one ordering/format defect to waste or information loss.
7. Integrate spill-first preservation before that defect.
8. Re-measure tokens/task, latency, re-runs, preservation rate, and task quality.
9. Run independent verification.

## Decision points
If the tool already returns scoped/queryable results, prefer narrower queries. If exact output may be needed later, spill before reduction. If content is sensitive, apply equivalent access controls and retention to the spill store.

## Expected output
Baseline, layer map, hypothesis, changed integration point, before/after metrics, and verification status.

## Metrics
Tokens/task, bytes/tool call, re-runs/task, p95 latency, preservation rate, retrieval success, quality/regression rate.

## Verification
Recover selected ranges and full files byte-for-byte using recorded SHA-256 digests.

## Failure handling
One retry for storage/transient I/O. If preservation still fails, block destructive truncation and scope the tool result instead.

## Stop conditions
Stop after two unsuccessful implementation hypotheses or any evidence of secret leakage/corruption; escalate for design review.