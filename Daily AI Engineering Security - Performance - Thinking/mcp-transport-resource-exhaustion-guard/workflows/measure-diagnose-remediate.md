# Workflow: Measure → Diagnose → Remediate → Verify

## Trigger
Security advisory, unexplained MCP memory growth, new transport deployment, or SDK upgrade.

## Goal
Prove that remote peers cannot drive unbounded memory retention.

## Inputs
Dependency versions, transport config, baseline telemetry, resource limits.

## Baseline
Measure steady-state buffered bytes, active sessions, idle ages, and RSS under representative normal traffic.

## Stages
1. **Observe:** capture transport mode and exposure.
2. **Measure baseline:** collect normal resource metrics.
3. **Diagnose:** enumerate peer-controlled retained state and cleanup paths.
4. **Form hypothesis:** state the precise growth mechanism and expected bound.
5. **Implement improvement:** upgrade, add limit/TTL, or change transport mode.
6. **Measure again:** run safe local adversarial fixtures.
7. **Improved?** If no, revise at most twice; if yes, independent verification.

## Responsible agent
Implementation owner performs remediation; Security Verifier performs final verification.

## Tools
Dependency manager, local fixture, process metrics, `resource_guard.py`, unit tests.

## Outputs
Before/after metrics, guard JSON, test results, verification decision.

## Checkpoints
After baseline, before adversarial test, after remediation, before release.

## Metrics
Peak buffer bytes, session count, idle age, RSS, process survival.

## Retry policy
Maximum 2 remediation attempts.

## Stop conditions
OOM, production impact, missing finite bound, or exhausted retries.

## Failure path
Disable or isolate the remote MCP transport and escalate.

## Verification
Independent verifier reproduces passing guard/test results.

## Definition of Done
Patched dependency, finite effective limits, safe local tests pass, before/after evidence recorded, no blocking issue remains.
