# Failure Diagnostics

## Purpose
Turn automation failures into actionable evidence that quickly separates product defects, test defects, data problems, and infrastructure failures.

## When to use
Use when designing reporting or investigating failed CI/regression runs.

## Inputs
Test result, logs, traces, screenshots/video, network records, environment metadata, recent changes.

## Context to inspect
First failure, retries, correlation IDs, server/client clocks, deployment version, test data, dependency health, and neighboring failures.

## Core knowledge
Diagnostics should preserve causal evidence near the first failure. More logs are not automatically better; structured correlation and relevant state beat noisy dumps.

## Procedure
1. Capture exact failing assertion/action and first-attempt artifacts.
2. Record build, environment, browser/device, worker, and data identifiers.
3. Correlate client actions with API/server logs and traces.
4. Compare with recent code/config/deployment changes.
5. Reproduce under controlled conditions.
6. Classify failure domain: product, test, environment, data, dependency, unknown.
7. Add targeted instrumentation if evidence is insufficient.
8. Create minimal reproduction and ownership handoff.
9. Feed recurring failure signatures into suite improvements.

## Decision points
Retry only to gather evidence or handle explicitly transient setup; never let retry erase the original failure. Capture video only when its diagnostic value justifies cost.

## Common failure patterns
Screenshots without logs, logs without correlation, reporting only the final retry, guessing root cause from stack trace alone, losing environment metadata.

## Verification
Intentionally fail representative UI/API tests and confirm artifacts allow another engineer to identify the failure domain without rerunning.

## Expected output
A reproducible failure record with evidence, classification, and next owner/action.

## Stop conditions
Escalate when required logs contain restricted data or production access is needed.