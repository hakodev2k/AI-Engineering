# Flaky Test Investigation

## Purpose
Find and remove nondeterminism instead of masking unreliable tests with retries.

## When to use
Use when a test alternates pass/fail without a relevant code change, differs by environment, or fails mainly under parallel load.

## Inputs
Failure history, traces, logs, screenshots, timing, environment metadata, test code, product code.

## Context to inspect
Synchronization, shared state, clocks, randomness, network dependencies, resource pressure, test order, cleanup, selectors, and parallel workers.

## Core knowledge
Flakiness is a defect in test, product, environment, or observability. Retries can reduce noise but must not erase the original failure signal.

## Procedure
1. Quantify failure rate and affected environments.
2. Preserve artifacts from first attempts.
3. Reproduce with repeated and parallel runs.
4. Vary order, latency, CPU, and timing deliberately.
5. Classify cause: synchronization, state, environment, product race, dependency, or assertion.
6. Replace sleeps with observable conditions.
7. Isolate mutable data/resources.
8. Fix product races when automation reveals genuine concurrency defects.
9. Add diagnostics for uncertain cases.
10. Remove quarantine/retry after sustained stability.

## Decision points
Quarantine only when the suite remains useful and ownership/deadline are explicit. Retry transient external operations narrowly; do not retry assertions indiscriminately.

## Common failure patterns
Increasing timeouts, unconditional retries, deleting failing tests, assuming CI is slow, fixing symptoms without reproducing root cause.

## Verification
Run the repaired test repeatedly under stress and normal CI conditions; track flake rate over subsequent runs.

## Expected output
Documented root cause, durable fix, and evidence of restored determinism.

## Stop conditions
Escalate when the root cause requires infrastructure or product changes outside QA authority.