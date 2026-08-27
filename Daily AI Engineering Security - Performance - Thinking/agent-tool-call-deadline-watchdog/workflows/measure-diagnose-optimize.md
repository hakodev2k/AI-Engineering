# Workflow: Measure → Diagnose → Optimize

## Trigger
Tool latency regression, stuck tool state, or new adapter onboarding.

## Goal
Bound tool execution while preserving legitimate long-running work and preventing duplicate side effects.

## Inputs
Telemetry, tool policy, schema, side-effect classification, representative fixtures.

## Baseline
Capture p50/p95/p99 latency, timeout/stall rate, mean recovery time, and retry count for the affected tool class.

## Stages
1. Observe and capture call lifecycle fields.
2. Measure baseline.
3. Diagnose validation, transport, subprocess, stream, or deadline-propagation failure.
4. Form one measurable hypothesis.
5. Implement the smallest deadline/validation/watchdog change.
6. Measure again with the same fixture set.
7. If not improved, revert/re-evaluate; maximum two implementation attempts.
8. Independent verification.

## Responsible agent
Performance investigator implements; Performance Verifier independently checks.

## Tools
Watchdog script, unit tests, latency metrics, read-only dependency health checks.

## Outputs
Baseline, hypothesis, implementation evidence, before/after table, verification decision.

## Checkpoints
Baseline captured; before retry-enabling change; after benchmark; before completion.

## Metrics
p95/p99 latency, stale-call rate, recovery time, retry rate, duplicate-side-effect count.

## Retry policy
Maximum two implementation attempts. Runtime automatic retry follows `config/policy.json`.

## Stop conditions
Possible duplicate write, exhausted wall-clock budget, no measurable improvement after two attempts, or missing telemetry.

## Failure path
Disable unsafe retry, restore prior stable deadline, surface the call for operator review.

## Verification
Independent verifier reproduces the stale-call fixture and confirms healthy baseline does not regress beyond agreed tolerance.

## Definition of Done
Baseline and after metrics exist; watchdog behavior is deterministic; tests pass; retries are bounded; no duplicate side effects occur.
