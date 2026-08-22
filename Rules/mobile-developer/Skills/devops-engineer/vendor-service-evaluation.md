# Vendor and Managed Service Evaluation

## Purpose
Evaluate platform services and vendors using operational, security, reliability, cost, and lock-in criteria.

## When to use
Use when choosing CI/CD, observability, secrets, cloud, registry, database, or infrastructure tooling.

## Inputs
Requirements, expected scale, SLOs, compliance, integrations, budget, team skills.

## Context to inspect
Existing stack, migration constraints, service limits, SLAs, pricing, data residency, support model, exit path.

## Core knowledge
Tool selection is an architecture decision. Compare total operating cost, failure modes, quotas, integration quality, portability, security controls, and team burden—not feature checklists alone.

## Procedure
1. Define mandatory and optional requirements.
2. Define workload and growth assumptions.
3. Compare operational model and failure domains.
4. Check security/compliance controls.
5. Evaluate quotas, limits, and SLA.
6. Model realistic cost including egress/support.
7. Run proof of concept on critical workflows.
8. Test failure/export/backup capabilities.
9. Assess migration and exit strategy.
10. Record decision and rejected alternatives.

## Decision points
Prefer managed services when undifferentiated operations cost dominates; self-host when control, economics, or constraints materially justify it.

## Common failure patterns
Feature-only comparison, ignoring egress, no load test, no exit plan, trusting SLA as architecture, vendor lock-in hidden until late.

## Verification
POC validates critical paths, limits and costs are documented, and decision has explicit trade-offs.

## Expected output
Evidence-based recommendation with risks, cost, and exit strategy.

## Stop conditions
Stop when critical compliance, data-residency, or recovery requirements are unresolved.