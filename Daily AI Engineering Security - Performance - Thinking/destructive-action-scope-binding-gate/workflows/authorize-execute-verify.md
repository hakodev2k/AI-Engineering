# Workflow: Authorize, Execute, Verify

## Trigger
A planned destructive mutation.

## Goal
Execute only the exact approved mutation and produce independent evidence.

## Inputs
Intent, policy, target inventory, actor/session identity.

## Baseline
Record current targets, fingerprints, and whether existing controls would execute without exact-scope validation.

## Context
Use explicit request text/IDs and observable action data, not hidden reasoning.

## Stages
1. Observe and classify intended operation.
2. Enumerate and normalize targets.
3. Measure baseline authorization coverage.
4. Form hypothesis about required narrow scope.
5. Build approval envelope and obtain human approval if policy requires.
6. Run pre-action hook/gate.
7. On PASS, execute once.
8. Capture post-state.
9. Independent Security Verifier reviews.

## Responsible agent
Planner/implementer for 1-8; independent Security Verifier for 9.

## Tools
Read-only inspection, approval interface, scope gate, mutation tool, audit logger.

## Outputs
Envelope, gate report, execution result, before/after state, verification verdict.

## Checkpoints
No mutation before gate PASS. State drift forces re-authorization.

## Metrics
Scope mismatch count, stale approval count, exact target coverage, recovery incidents.

## Retry policy
Maximum one re-authorization after a blocked/stale envelope.

## Stop conditions
Second failure, ambiguous intent, missing human approval, or any request to weaken controls.

## Failure path
Do nothing destructive; preserve evidence; escalate.

## Verification
Replay gate and compare actual mutation log with envelope.

## Definition of Done
Exact scope authorized, executed once, postconditions captured, independent PASS, no blocking issue.