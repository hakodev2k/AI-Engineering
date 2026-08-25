# Workflow — Regression Verification

## Trigger
Any change to provenance capture, classifier integration, fallback routing, or policy.

## Goal
Prove the change improves diagnosability without increasing unsafe approvals.

## Inputs
Before/after traces, policy, fixtures, implementation diff.

## Baseline
False-positive review rate, block rate, identical retries, unavailable outcomes, p95 latency.

## Stages
1. Run baseline unit tests.
2. Run trusted-control false-positive fixtures.
3. Run untrusted injection fixtures.
4. Run unavailable fixtures across all risk classes.
5. Compare decisions and latency.
6. Safety Reviewer checks any newly allowed case.

## Checkpoints
Any new `allow`, fallback change, or missing provenance.

## Retry policy
Maximum two fix-and-retest cycles; third failure stops.

## Failure path
Restore last verified policy/implementation, preserve evidence, escalate.

## Verification
All tests pass; no unsafe false-negative fixture; risky outages do not auto-approve; provenance hashes remain stable.

## Definition of Done
Implemented, Measured, and Verified statuses are recorded separately; no blocking issue remains.
