# DevOps Technical Risk Assessment

## Purpose
Assess operational risk before platform, deployment, infrastructure, or tooling decisions.

## When to use
Use before high-impact changes, migrations, new shared services, or architecture decisions affecting production operations.

## Inputs
Proposed change, architecture, dependencies, data, blast radius, recovery capability, team maturity.

## Context to inspect
Incident history, SLOs, backups, access model, change frequency, monitoring, capacity, vendor limits.

## Core knowledge
Risk combines likelihood, impact, detectability, reversibility, and exposure duration. Senior engineers make assumptions explicit and choose mitigations proportional to real failure modes.

## Procedure
1. Define scope and assets affected.
2. Enumerate credible failure modes.
3. Estimate impact and blast radius.
4. Assess detection and recovery time.
5. Identify irreversible transitions.
6. Review security and data risks.
7. Rank risks using consistent criteria.
8. Select preventive/detective/recovery controls.
9. Assign owner for residual risk.
10. Reassess after testing or rollout evidence.

## Decision points
Avoid a change when residual risk exceeds business tolerance; use phased rollout to buy evidence; accept risk explicitly when mitigation cost is disproportionate.

## Common failure patterns
Generic risk lists, no owner, optimistic rollback assumptions, ignoring shared dependencies, scoring without evidence.

## Verification
Top risks map to concrete controls and tests, residual risk is explicit, and decision makers understand trade-offs.

## Expected output
Prioritized risk register with mitigations, evidence, and escalation points.

## Stop conditions
Stop when high-impact unknowns cannot be reduced enough for a safe decision.