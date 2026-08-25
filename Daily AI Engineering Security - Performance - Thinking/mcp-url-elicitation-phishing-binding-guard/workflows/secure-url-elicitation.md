# Workflow — Secure URL Elicitation

## Trigger
New/changed URL elicitation, OAuth/payment link, or MCP protocol migration.

## Goal
Prevent phishing, cross-user binding, replay, and secret leakage while preserving legitimate browser flows.

## Inputs
Implementation, protocol versions, auth model, redirect policy, test identities.

## Baseline
Capture behavior for valid flow, wrong principal, replay, expiry, origin change, and unsupported URL capability.

## Stages
1. Observe request/completion paths.
2. Measure baseline attack-fixture results.
3. Diagnose missing binding or unsafe navigation.
4. Form one explicit hypothesis.
5. Implement fail-closed binding checks.
6. Measure again with identical fixtures.
7. Independent verifier reviews source and evidence.
8. Record Implemented, Measured, Verified separately.

## Responsible agent
Implementation agent changes code; verifier is independent.

## Tools
`scripts/elicitation_binding_guard.py`, unit/integration tests, sanitized traces.

## Outputs
Before/after matrix, binding evidence, test results, verification decision.

## Checkpoints
After baseline, implementation, regression run, independent review.

## Metrics
Blocked attack fixtures, legitimate success, replay rejection, false positives.

## Retry policy
Maximum 2 implementation iterations; each requires a changed hypothesis or implementation.

## Stop conditions
Stop on secret exposure, unknown principal identity, or unresolved cross-user completion.

## Failure path
Keep URL mode disabled for the affected feature and escalate; never fall back to in-band secret collection.

## Verification
Legitimate binding succeeds once; mismatch, replay, expiry, invalid scheme, userinfo, and origin drift fail closed.

## Definition of Done
Evidence documented; baseline captured; implementation and tests complete; risks documented; independent verification passes; no blocker remains.
