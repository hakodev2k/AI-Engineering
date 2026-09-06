# Workflow: Preflight and Runtime Verification

## Trigger
New evaluation run, high-risk phase transition, or invalidating environment change.

## Goal
Prevent execution when effective network containment cannot be demonstrated from runtime evidence.

## Inputs
Policy, observed network events, run ID, environment-change record.

## Baseline
Record intended network mode, approved destinations, proxy/cache endpoints, policy hash and current event coverage.

## Context
The declared configuration is a hypothesis; observed runtime behavior is the verification evidence.

## Stages
1. **Observe** — collect sanitized direct/proxy/DNS destination events.
2. **Measure baseline** — count observed and classified destinations.
3. **Diagnose** — run the deterministic attestation and identify unknown/forbidden paths.
4. **Form hypothesis** — map each violation to likely route: direct, proxy/cache, shared service, DNS/proxy drift, credentialed service.
5. **Implement improvement** — environment owner remediates outside this workflow with human approval where required.
6. **Measure again** — collect a fresh observation window and re-run attestation.
7. **Verify** — Containment Verifier independently reproduces the result.
8. **Complete** — attach PASS artifact to run metadata.

## Responsible agent
Environment owner performs remediation; `subagents/containment-verifier.md` performs independent verification.

## Tools
`scripts/attest_egress.py`, firewall/proxy/DNS telemetry exporters, unit tests.

## Outputs
Attestation JSON, violation list, verification record.

## Checkpoints
Pre-run; before reduced-safeguard/high-risk execution; after any invalidating change.

## Metrics
Unknown/forbidden count, classification coverage, time-to-detect, time-to-re-attest.

## Retry policy
Maximum 2 remediation/verification cycles per run. Retry only after a concrete configuration or evidence-collection change.

## Stop conditions
Immediate BLOCK on unknown/forbidden destinations or missing telemetry. Stop after 2 failed cycles and escalate to the evaluation owner/security lead.

## Failure path
Preserve sanitized evidence, quarantine the run, revoke unnecessary credentials if approved by the owner, and investigate the route. Never continue by broadening the allowlist merely to obtain PASS.

## Verification
Independent verifier reproduces PASS from the same policy and fresh telemetry; unit tests pass; runner respects non-zero exit status.

## Definition of Done
Evidence documented; policy version recorded; zero forbidden/unknown observed events; test suite passes; independent verification complete; no blocking coverage gap remains.
