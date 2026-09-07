# Guardrail Design Review

## Purpose
Determine whether proposed guardrails establish invariants with acceptable usability, reliability, cost, and operations.

## When to use
Use before major safety architecture, agent capability, sensitive-data, or enforcement changes.

## Inputs
Requirements, architecture, threat model, flows, tools, models, evaluation, SLOs, rollout.

## Context to inspect
Inspect current architecture/incidents, identity, data classes, controls, topology, ownership.

## Core knowledge
Ask what must never happen, where enforced, failure behavior, verification, and operational detection.

## Procedure
1. Restate goals/invariants.
2. Validate threats.
3. Trace authority/data.
4. Review enforcement independence.
5. Challenge semantic-only boundaries.
6. Review data/tenancy.
7. Review reliability/cost.
8. Review observability/rollback.
9. Review evaluation/gates.
10. Record trade-offs/risk.

## Decision points
Approve only with independently enforceable critical invariants and evidence plans.

## Common failure patterns
No authority flows, no degraded mode, missing owner, postponed evaluation, broad privileged tools behind semantic checks.

## Verification
Every mitigation has executable verification.

## Expected output
Design decision with blockers/trade-offs/residual risk.

## Stop conditions
Do not approve unresolved high-severity/cross-tenant/unverifiable risk.