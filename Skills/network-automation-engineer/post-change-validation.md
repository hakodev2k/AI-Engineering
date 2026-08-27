# Post-Change Validation

## Purpose
Verify that network changes achieved intended behavior without hidden regressions.

## When to use
Use after any automated configuration or infrastructure change.

## Inputs
Pre-change baseline, acceptance criteria, intended state, operational telemetry, routing/session state, and application probes.

## Context to inspect
Config state, interfaces, protocols, routes, policies, reachability, latency/loss, logs, and dependent services.

## Core knowledge
Successful command/API responses prove mutation, not correctness. Verification must test operational behavior and relevant end-to-end outcomes.

## Procedure
1. Confirm intended configuration is present.
2. Compare critical state with pre-change baseline.
3. Validate interfaces, adjacencies, routes, tunnels, and policy counters relevant to the change.
4. Run targeted reachability and service probes.
5. Check errors, drops, CPU/memory, and logs.
6. Observe convergence for an appropriate stabilization period.
7. Evaluate acceptance thresholds.
8. Roll back if defined failure criteria trigger.
9. Capture evidence and final state.
10. Update source of truth if lifecycle state changed.

## Decision points
Use change-specific checks rather than generic device health alone. Extend observation for protocols with slow convergence or delayed traffic shifts.

## Common failure patterns
Declaring success on config commit, no end-to-end probes, ignoring partial route loss, comparing against no baseline, and missing delayed failures.

## Verification
Acceptance criteria must be machine-evaluable where practical and include both intended state and service behavior.

## Expected output
Postcheck report, before/after evidence, acceptance result, and rollback status.

## Stop conditions
Escalate and halt rollout on unexplained regression, partial convergence, or conflicting telemetry.