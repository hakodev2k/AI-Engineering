# CI Quality Gates

## Purpose
Integrate automation into CI so feedback is fast, reproducible, and proportional to release risk.

## When to use
Use when defining PR checks, merge gates, scheduled regression, or deployment verification.

## Inputs
Pipeline topology, suites, runtime, flake rate, release policy, infrastructure budget.

## Context to inspect
Changed components, test dependencies, worker capacity, artifact retention, branch policy, deployment stages, and historical failure causes.

## Core knowledge
A gate must be trustworthy enough that teams act on it. Split fast deterministic PR evidence from slower broad regression; parallelize safely; preserve diagnostics.

## Procedure
1. Classify tests by speed, risk, and dependencies.
2. Define mandatory PR gates with bounded duration.
3. Shard/parallelize suites without shared-state collisions.
4. Cache dependencies safely, not test outcomes.
5. Publish machine-readable and human-readable results.
6. Preserve traces/logs/screenshots for failures.
7. Separate infrastructure failures from product failures where possible.
8. Add scheduled or pre-release suites for broader coverage.
9. Define quarantine ownership and expiry.
10. Monitor gate duration, reliability, and defect escape rate.

## Decision points
Fail fast for deterministic blockers; continue enough execution to collect useful evidence when diagnosis benefits. Use selective testing only with reliable dependency mapping.

## Common failure patterns
Hour-long PR suites, hidden retries, no artifacts, shared environments, gates everyone ignores, flaky tests blocking merges indefinitely.

## Verification
Run clean pipeline executions, simulate a product defect and infrastructure failure, and confirm each produces the intended gate and diagnostics.

## Expected output
A tiered CI test model with explicit gates, artifacts, runtime targets, and ownership.

## Stop conditions
Escalate when branch/release policy conflicts with agreed quality risk.