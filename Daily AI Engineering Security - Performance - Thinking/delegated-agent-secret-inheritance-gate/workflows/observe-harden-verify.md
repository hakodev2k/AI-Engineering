# Workflow: Observe, Harden, Verify

## Trigger
Delegation path added/changed or secret-visibility finding.

## Goal
Minimize child credential visibility and prove it with negative tests.

## Inputs
Delegation source/config, parent name inventory, child requirements, policy.

## Baseline
Capture parent vs child environment names, inheritance mode, readable sensitive count, brokered count, checker result.

## Stages
1. Observe delegation and credential paths.
2. Measure baseline with sentinel-only credentials.
3. Diagnose implicit inheritance/late filtering.
4. Form smallest safe filtering/broker hypothesis.
5. Implement allowlist/broker.
6. Measure again.
7. If not improved, revise once; maximum 2 remediation cycles.
8. Independent review.

## Responsible agent
Implementation owner stages 1-7; Security Reviewer stage 8.

## Tools
Source/config reader, mock child runner, checker, tests.

## Outputs
Before/after matrix, diff, test evidence, reviewer decision.

## Checkpoints
Real secret output or unknown inheritance blocks completion.

## Metrics
Unauthorized sensitive names 0; implicit inheritance 0; negative-test failures 0.

## Retry policy
Maximum 2 remediation cycles; one transient introspection retry.

## Stop conditions
Bounded retries exhausted, secret disclosure, or architecture cannot isolate child.

## Failure path
Keep delegation disabled/credential unavailable and escalate; never widen allowlist for convenience.

## Verification
Independent reviewer confirms PASS and sentinel absence.

## Definition of Done
Implemented, measured, independently verified, no blocker.