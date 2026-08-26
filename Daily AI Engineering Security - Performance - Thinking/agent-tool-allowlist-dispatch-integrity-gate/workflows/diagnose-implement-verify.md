# Workflow — Diagnose, Implement, Verify

## Trigger
Authorization bypass report, framework upgrade affecting tool calling, or a new execution lane.

## Goal
Make the runtime dispatch boundary enforce the same or narrower capability set than the request/agent policy.

## Inputs
Current policy, capability registry, dispatcher paths, traces, reproduction fixture.

## Baseline
Record which capabilities are advertised, which are globally resolvable, and whether a hidden capability can currently execute.

## Stages
1. **Observe:** reproduce without destructive side effects.
2. **Measure baseline:** count dispatch paths and negative-fixture failures.
3. **Diagnose:** locate where effective scope is dropped or global fallback occurs.
4. **Form hypothesis:** identify one concrete bypass path.
5. **Implement:** centralize the final membership check or equivalent fail-closed guard.
6. **Measure again:** rerun hidden-capability and nested-delegation fixtures.
7. **Verify:** independent verifier reviews all alternate lanes.

## Responsible agent
Implementation owner for stages 1–6; Dispatch Security Verifier for stage 7.

## Tools
Repository inspection, native test runner, `scripts/dispatch_guard.py`.

## Outputs
Before/after evidence, authorization matrix, test results, unresolved-risk record.

## Checkpoints
After baseline; before code mutation; before final verification.

## Metrics
Unauthorized dispatches = 0; dispatch-path enforcement coverage = 100%; negative-fixture block rate = 100%.

## Retry policy
Maximum 2 implementation revisions.

## Stop conditions
Secret exposure, production mutation risk, missing effective principal/scope, or exhausted retries.

## Failure path
Disable affected privileged capability/lane and escalate to owner.

## Definition of Done
Implemented, measured, and independently verified with no path that widens authority.
