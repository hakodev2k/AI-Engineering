# Workflow: Measure, Diagnose, Optimize, Verify

## Trigger
Retry storm, high retry latency/cost, repeated tool errors, or expensive job termination on a transient failure.

## Goal
Reduce wasted retry work while preserving or improving transient-failure recovery.

## Inputs
Traces, error codes/classes, retry configuration, call/token/cost metrics, workload fixtures.

## Baseline
Measure retries/task, repeated fingerprints, time-to-terminal, retry latency, calls, tokens/cost, recovery rate, and end-to-end task success.

## Context
Enumerate nested retry layers before changing policy so hidden SDK retries are counted.

## Stages
1. Observe representative failures.
2. Measure baseline.
3. Diagnose retry layers and normalize errors.
4. Form a falsifiable hypothesis about over- or under-retry.
5. Implement the smallest policy/control change.
6. Replay the same fixtures.
7. Measure again.
8. Compare metrics and success guardrail.
9. If not improved, re-evaluate once with new evidence.
10. Independent Retry Verifier reviews results.

## Responsible agent
Performance investigator/implementation agent; independent Retry Verifier for final verification.

## Tools
Trace/metrics readers, controlled failure fixtures, tests, `retry_guard.py`.

## Outputs
Baseline, error taxonomy, policy, before/after comparison, verifier result.

## Checkpoints
Baseline captured before implementation; security/idempotency check before enabling any retry; metric comparison before completion.

## Metrics
Retries, latency, calls, tokens, cost, recovery, false retry/stop, success rate.

## Retry policy
The optimization workflow itself gets at most two tuning cycles.

## Stop conditions
Two failed tuning cycles, degraded task success beyond accepted tolerance, security boundary regression, or unclassifiable high-risk error.

## Failure path
Restore last known-safe policy, preserve evidence, and escalate with measured failure class.

## Verification
The verifier reruns at least transient, terminal, repeated-no-progress, and unknown-class fixtures.

## Definition of Done
Measured improvement in wasted retry work with maintained/improved success and no security regression.