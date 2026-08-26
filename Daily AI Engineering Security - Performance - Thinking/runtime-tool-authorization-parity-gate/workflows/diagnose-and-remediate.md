# Workflow: Diagnose and Remediate Authorization Drift

**Trigger:** new tool resolver, framework upgrade, security finding, or parity-test failure.  
**Goal:** identify and remove any path that dispatches outside request scope.

## Inputs
Request fixture, advertised tool set, global registry, dispatcher path, approval policy.

## Baseline
Capture current allow/deny outcomes for one advertised, one hidden, and one high-risk tool.

## Stages
1. Observe model-visible tool scope.
2. Measure actual direct-dispatch behavior.
3. Diagnose resolver/fallback paths.
4. Form a concrete hypothesis for authorization drift.
5. Implement the smallest gate that enforces request membership at dispatch.
6. Measure the same fixtures again.
7. If not improved, revise hypothesis at most twice.
8. Hand to independent verifier.

## Responsible agent
Implementation engineer; Security Verifier performs final verification.

## Tools
Repository inspection, unit/integration tests, `scripts/authorization_parity_gate.py`.

## Outputs
Before/after decision matrix, root cause, patch evidence, verification status.

## Checkpoints
After baseline, before code change, after tests, before release.

## Metrics
100% denial of hidden tools; 100% approval enforcement for configured high-risk tools; zero context mismatches allowed.

## Retry policy
Maximum two implementation revisions.

## Stop conditions
Confirmed secret exposure, production write risk, unresolved hidden-tool dispatch, or retry exhaustion.

## Failure path
Disable affected tool binding or resolver fallback; escalate to security owner.

## Verification
Independent direct-dispatch reproduction.

## Definition of Done
Baseline documented, root cause identified, gate implemented, tests pass, reviewer independently verifies no scope escalation.
