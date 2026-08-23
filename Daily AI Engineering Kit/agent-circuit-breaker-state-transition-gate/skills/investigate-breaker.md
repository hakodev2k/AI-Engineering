# Investigate Circuit Breaker Behavior

## Purpose
Determine whether breaker transitions match real dependency health rather than assumptions.

## When to use
Unexpected open circuits, cascading dependency failures, excessive fallback traffic, or a proposed breaker-policy change.

## Inputs
Service/operation identity, policy, request outcomes, timestamps, current state, relevant tests/logs.

## Preconditions
Read-only production access only; secrets redacted; evidence window identified.

## Allowed tools
Repository search, log/metric reads, test runners, `scripts/validate-circuit.py`.

## Constraints
No production mutation. No policy weakening. Separate facts, hypotheses, decisions, and open questions.

## Process
1. Locate caller, dependency client, breaker configuration, fallback, and tests.
2. Identify breaker scope and all failure classifications.
3. Collect an ordered observation window and state-transition evidence.
4. Exclude configured non-retryable/caller failures from health calculations.
5. Calculate minimum volume and failure rate.
6. Check open duration and transition into half-open.
7. Check probe concurrency and required successful probes.
8. Reproduce behavior in tests or a non-production harness.
9. Run deterministic validator against captured evidence.
10. Record confirmed defect, configuration issue, or insufficient evidence.

## Expected output
Evidence JSON conforming to `schemas/evidence.schema.json`, finding, confidence, affected component, risk, recommendation, and verification status.

## Verification
Observed transitions and automated reproduction agree with configured policy.

## Failure handling
Retry transient log/tool reads at most twice. Do not retry permission/validation failures; preserve evidence and stop.

## Stop conditions
Missing evidence needed to classify failures; approval-required production change; two repeated tool failures; contradictory evidence not resolved by available context.
