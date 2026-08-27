# Workflow: Regression Verification

**Trigger:** change to tool-output admission, truncation, externalization, summarization, or compaction policy.  
**Goal:** prove the new policy prevents aggregate overflow without hiding required evidence.

## Inputs
Budget config, guard script, representative traces, task acceptance tests.

## Baseline
At least one healthy trace, one individual-oversize trace, one many-medium-results aggregate-overflow trace, and one near-context-limit trace.

## Stages
1. Run deterministic unit tests.
2. Replay healthy trace and confirm no unnecessary blocking.
3. Replay aggregate-overflow trace and confirm preflight blocks before model request.
4. Verify reserved output headroom and safety margin.
5. Verify externalized/summarized results retain required evidence references.
6. Compare task result quality and latency/tokens.
7. Verify identical overflow retries stop at configured bound.

## Metrics
Overflow-prevention rate, benign-admission rate, tokens/task, latency, evidence-retention coverage, quality regression rate.

## Retry policy
One correction and one complete rerun.

## Stop conditions
Any over-limit request is sent, required evidence is lost, or quality/safety regression is detected.

## Failure path
Revert the optimization or increase evidence priority; do not increase context limits as the sole workaround.

## Verification
Token Budget Verifier must be independent from implementer.

## Definition of Done
All fixtures pass, before/after metrics recorded, overflow blocked preflight, required context preserved.
