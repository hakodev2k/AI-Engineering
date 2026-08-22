# Workflow: Secret Egress Hardening

## Trigger
New credential-bearing integration, observed leak, multi-profile deployment, or security review.

## Goal
Prevent raw registered secrets from reaching any unauthorized model, transcript, log, subprocess, artifact, or network sink.

## Inputs
Source/sink inventory, synthetic canaries, current configuration/code, identity model, approved flows.

## Baseline
Record current leak count per sink, number of secrets inherited by representative subprocesses, and cross-profile canary exposure.

## Stages
1. **Observe** — collect sanitized baseline traces using synthetic canaries.
2. **Diagnose** — map each leak to admission, resolution, inheritance, or egress-filter failure.
3. **Hypothesize** — select the narrowest architectural fix: opaque reference, sink-side resolver, explicit env allowlist, identity binding, or centralized egress scanner.
4. **Implement** — change one boundary at a time without weakening sandbox/approval controls.
5. **Measure again** — rerun identical fixtures.
6. **Verify** — Security Verifier independently checks all declared sinks and profile boundaries.
7. **Complete** — record before/after counts, residual risks, and status.

## Responsible agent
Implementation owner performs changes; `subagents/security-verifier.md` performs independent verification.

## Tools
`scripts/secret_egress_guard.py`, unit tests, mock network sink, sandboxed subprocess fixtures.

## Outputs
Source/sink matrix, baseline metrics, remediation evidence, verification report.

## Checkpoints
- Before implementation: every credential source has an owner.
- Before raw resolution: tenant/profile and capability are explicit.
- Before dispatch/persistence: egress scanner passes.
- Before completion: independent verifier returns PASS.

## Metrics
Unauthorized secret egress count, model-visible canary count, subprocess canary count, cross-profile leaks, tested sinks/declared sinks.

## Retry policy
Maximum two remediation iterations. A retry must target a newly evidenced cause.

## Stop conditions
Production secret appears in test evidence; identity is ambiguous; required sink cannot be inspected; or the same leak remains after two changed attempts.

## Failure path
Block the affected credential flow, preserve sanitized evidence, escalate to the security owner, and request rotation only through authorized operations if a real credential crossed the boundary.

## Verification
All synthetic canaries must be absent from unauthorized raw outputs while intended authenticated actions still succeed through scoped resolution.

## Definition of Done
Baseline exists; limitation/root cause documented; remediation implemented; all tests pass; before/after leak counts are zero for covered unauthorized sinks; intended actions still function; independent PASS recorded; no production secret or security weakening occurred.