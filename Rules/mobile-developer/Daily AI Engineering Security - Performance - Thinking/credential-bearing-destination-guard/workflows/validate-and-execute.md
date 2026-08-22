# Workflow — Validate and Execute Credentialed Request

## Trigger
An agent tool is about to send a request carrying credentials or signed authorization material.

## Goal
Allow only credential-bearing requests whose concrete destination is authorized independently of model-generated arguments.

## Inputs
Tool call, normalized operation, credential class, policy, optional trusted service-discovery result, optional human approval.

## Baseline
Record current behavior with fake credentials against fixtures: expected endpoint, attacker domain, loopback, RFC1918, link-local, disallowed port, URL userinfo, redirect, changed approved destination.

## Context
The model and retrieved content are untrusted for authorization. Tool arguments are data, not policy.

## Stages
1. **Observe** — identify credential attachment point and requested destination.
2. **Measure baseline** — run the fixture suite and record which unsafe cases currently pass.
3. **Diagnose** — decide whether free-form destination control can be removed.
4. **Form hypothesis** — define the narrowest trusted endpoint derivation or allowlist that should block the attack path.
5. **Implement** — call `scripts/destination_guard.py` before credential attachment/send; configure the HTTP client with redirects disabled; keep secrets out of logs.
6. **Measure again** — rerun all baseline fixtures.
7. **Improved?** — if any unsafe fixture passes, return to Diagnose. Maximum two remediation iterations.
8. **Independent verification** — hand evidence to `subagents/security-verifier.md`.
9. **Complete** — mark Implemented, Measured, and Verified separately.

## Responsible agent
Implementation owner for stages 1–7; independent Security Verifier for stage 8.

## Tools
Repository inspection, local fake-secret tests, `scripts/destination_guard.py`, HTTP mocks, DNS/IP classifiers, security advisory references.

## Outputs
Decision record, sanitized test evidence, policy, residual-risk statement, verifier result.

## Checkpoints
- Before implementation: baseline exists.
- Before request send: deterministic guard succeeds.
- Before approval: destination + credential class + operation are visible without secret values.
- Before completion: independent verifier passes.

## Metrics
Unsafe fixture pass count (target 0), valid fixture success rate, guard coverage (target 100% credential-bearing paths), redirect-follow count (target 0), secret-in-log findings (target 0).

## Retry policy
Maximum 2 remediation iterations. Network/DNS transient failures may be retried once for measurement only; an authorization denial is never retried as a bypass attempt.

## Stop conditions
Stop and block when policy cannot distinguish trusted destinations, real credentials may have leaked, redirects cannot be disabled/revalidated, or tests require weakening TLS/security boundaries.

## Failure path
Block the operation, preserve sanitized evidence, rotate exposed credentials when applicable, and escalate to the security/service owner.

## Verification
All adversarial fixtures blocked; expected fixtures pass; approval binding tested; no secret values logged; independent verifier signs off.

## Definition of Done
Evidence documented; baseline captured; guard implemented; tests measured; residual risks documented; required approval policy enforced; independent verification complete; no blocking finding remains.
