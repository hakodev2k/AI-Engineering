# Workflow: Inventory, Enforce, Verify

## Trigger
Protected agent artifact is introduced or any mutation path changes.

## Goal
Ensure every path capable of changing a shared/template agent enforces the same authorization boundary.

## Inputs
Protected resource definition, route/tool inventory, authorization design, downstream identity model.

## Baseline
Capture current mutation paths and run the parity checker before remediation. Record any unauthorized scoped-caller test that succeeds.

## Context
Document shared/session ownership, caller roles, runner permissions, MCP executable fields and audit destination.

## Stages
1. **Observe** — enumerate all direct and indirect mutation effects.
2. **Measure baseline** — populate `config/mutation-paths.json`; run parity checker and negative tests.
3. **Diagnose** — identify missing control or lost caller scope.
4. **Form hypothesis** — state how a scoped caller reaches the protected effect.
5. **Implement improvement** — centralize resource-level authorization or add equivalent backend enforcement.
6. **Measure again** — repeat parity check and every scoped-caller negative test.
7. **Decision** — if any path still mutates or parity fails, re-evaluate; otherwise continue.
8. **Verify** — independent Security Verifier confirms attack path is blocked.

## Responsible agent
Security implementer owns stages 1–7; `subagents/security-verifier.md` owns stage 8.

## Tools
Code search, route/tool inventory, `python scripts/policy_parity_check.py config/mutation-paths.json`, isolated security tests.

## Outputs
Mutation inventory, baseline violations, remediation record, passing parity report, negative-test evidence, verifier verdict.

## Checkpoints
Inventory completeness, pre-change parity result, post-change negative tests, independent review.

## Metrics
Inventory coverage, parity violations, unauthorized mutation success count, downstream re-authorization coverage, audit coverage.

## Retry policy
Maximum two remediation attempts per authorization gap. A retry must change the enforcement mechanism or add new evidence.

## Stop conditions
Stop when attack path is blocked and independently verified; or on unknown mutation coverage, unresolved downstream authority, unsafe test environment, or two failed remediation attempts.

## Failure path
Preserve evidence, block release, disable the affected mutation capability if safely possible, and escalate to the security/platform owner. Do not compensate by widening caller permissions.

## Verification
Parity checker passes; every protected path rejects scoped unauthorized mutation; authorized admin path still functions; audit record is generated; no secrets appear in logs.

## Definition of Done
Evidence documented; inventory complete; all required controls enforced; negative tests pass; authorized behavior preserved; audit verified; independent verdict `verified`; no blocking issue remains.
