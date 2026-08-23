# CI Quality Engineering

## Purpose
Design fast, reliable CI feedback that gives developers trustworthy evidence about changes.

## When to use
Use when building or improving test pipelines, merge checks, and quality feedback loops.

## Inputs
Pipeline configuration, test suites, runtimes, failure history, infrastructure limits, branching model.

## Context to inspect
Inspect stage dependencies, parallelism, caching, test selection, artifacts, flaky tests, queue time, and failure diagnostics.

## Core knowledge
Feedback latency changes developer behavior. Optimize total time-to-signal, not only individual test speed. Determinism and diagnostic quality matter as much as throughput.

## Procedure
1. Measure queue, setup, execution, and diagnosis time.
2. Put cheap high-signal checks earliest.
3. Parallelize isolated workloads safely.
4. Separate fast merge checks from slower confidence suites.
5. Cache immutable dependencies correctly.
6. Publish logs, traces, screenshots, and reports needed for diagnosis.
7. Track flake and infrastructure-failure rates.
8. Quarantine only with owner and expiry.
9. Remove redundant low-value checks.
10. Monitor feedback latency over time.

## Decision points
Use selective testing only when dependency mapping is trustworthy; retain broader scheduled coverage for uncertainty.

## Common failure patterns
Serial execution, blind retries, giant E2E gates, stale caches, and failures with no artifacts.

## Verification
Measure median and tail feedback times, deterministic reruns, and actionable failure evidence.

## Expected output
A layered CI quality pipeline with reliable fast feedback.

## Stop conditions
Escalate when pipeline changes require unavailable infrastructure permissions or weaken mandatory controls.