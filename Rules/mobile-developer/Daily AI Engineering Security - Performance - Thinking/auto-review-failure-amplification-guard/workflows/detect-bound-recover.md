# Workflow: Detect, Bound, Recover

## Trigger
An expected-in-sandbox operation fails and orchestration proposes execution with broader permission.

## Goal
Prevent repeated identical internal failures from multiplying approval-model calls while preserving review for real boundary crossings.

## Inputs
Operation metadata, policy, failure evidence, counters, token estimates, sandbox-health status.

## Baseline
Record review calls/task, repeated-review ratio, reviewer input tokens, task latency, successful in-sandbox operations, and legitimate boundary reviews.

## Stages
1. **Observe** — Investigator classifies scope and normalizes failure.
2. **Measure** — Run analyzer in report mode and capture baseline.
3. **Hypothesize** — Determine whether one persistent sandbox failure drives repeated allowed escalations.
4. **Gate** — Run pre-review hook. New boundary requests continue to review; repeated expected-in-sandbox fingerprints increment bounded counters.
5. **Break** — At threshold, block another automatic review and run one sandbox-health check.
6. **Recover** — If health is restored, retry once in sandbox. If not, stop and require human remediation.
7. **Measure again** — Replay equivalent workload with guard enabled.
8. **Verify** — Independent Verification Agent checks security and efficiency.

## Checkpoints
After classification, before escalation, after breaker activation, after health check, before completion.

## Metrics
Reviews/fingerprint <= 3 per 30-minute window; reviewer token growth bounded; legitimate boundary review coverage 100%; no automatic out-of-sandbox execution from breaker path.

## Retry policy
One sandbox-health retry after breaker activation. Maximum two end-to-end guard experiments during tuning.

## Failure path
Unknown scope or ambiguous permission -> human review. Persistent health failure -> stop automatic workflow and preserve evidence.

## Stop conditions
Verified recovery, human intervention required, or two unsuccessful tuning attempts.

## Definition of Done
Baseline recorded; guard implemented; replay shows bounded repeated reviews; legitimate review coverage preserved; tests pass; risks documented; independent verification complete.