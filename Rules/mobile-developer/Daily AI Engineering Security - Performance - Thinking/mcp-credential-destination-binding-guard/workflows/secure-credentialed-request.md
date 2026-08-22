# Workflow — Secure Credentialed Request

## Trigger
A tool accepts a runtime destination and may send credentials to it.

## Goal
Make destination authorization deterministic, testable, and independent of model reasoning.

## Inputs
Tool implementation, credential classes, legitimate destination patterns, request/redirect behavior, policy file, fake-credential test environment.

## Baseline
Before change, record which request paths accept dynamic destinations, where credentials are attached, whether redirects are enabled, and whether unauthorized hosts can reach the request layer in tests.

## Context
Use `evidence/research.md`, `rules/destination-boundary.md`, `config/policy.json`, and the affected implementation.

## Stages
1. **Observe** — map input-to-request data flow and credential attachment points.
2. **Measure baseline** — run benign and adversarial fixtures; record current allow/deny behavior.
3. **Diagnose** — identify missing authorization, weak normalization, redirect forwarding, or overly broad policy.
4. **Form hypothesis** — define the smallest deterministic policy change expected to block the attack path while preserving legitimate targets.
5. **Implement** — authorize normalized destination before credentials are attached; bind approval when needed.
6. **Measure again** — rerun identical fixtures and capture decisions.
7. **Independent verification** — Security Verifier reviews code and evidence.
8. **Complete** — document residual risk and final status.

## Responsible agent
Implementation owner for stages 1–6; `subagents/security-verifier.md` for stage 7.

## Tools
Repository inspection, tests, fake HTTP endpoint, and `python scripts/validate_destination.py <fixture> --policy config/policy.json`.

## Outputs
Baseline table, policy, implementation, test results, verifier result, residual-risk record.

## Checkpoints
- C1: all credential-bearing request sites identified.
- C2: baseline includes at least one unauthorized-host reproduction or a proven pre-existing block.
- C3: credentials are attached only after authorization.
- C4: redirect behavior verified.
- C5: independent verification passes.

## Metrics
Unauthorized-host block rate, legitimate-target pass rate, redirect revalidation coverage, approval-binding coverage, secret leakage findings.

## Retry policy
Maximum 2 implementation/remediation cycles. Each retry must change a falsifiable hypothesis or implementation; identical retries are forbidden.

## Stop conditions
Stop and escalate after 2 failed remediation cycles, on ambiguous credential scope, or if a real secret is exposed. Never weaken destination policy to force completion.

## Failure path
Preserve failing fixture and request trace, mark verification failed, disable or constrain the affected tool where feasible, and require human security review before release.

## Verification
Security Verifier must reproduce blocked attacker cases and confirm a legitimate case still succeeds with fake credentials.

## Definition of Done
Evidence documented; baseline captured; deterministic authorization implemented; adversarial tests pass; no secrets exposed; independent verification complete; no blocking issue remains.
