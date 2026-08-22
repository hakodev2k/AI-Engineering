# Dependency Management

## Purpose
Make cross-team, external, technical, and organizational dependencies explicit and actively manage the conditions required for delivery.

## When to use
Use for multi-team projects, vendor integrations, shared platforms, approval chains, migrations, and constrained release environments.

## Inputs
Delivery plan, architecture, interfaces, milestone dates, owners, lead times, service commitments, and external plans.

## Context to inspect
Inspect upstream/downstream roadmaps, API or contract stability, procurement, environments, data availability, approvals, and shared-resource contention.

## Core knowledge
A dependency is not managed merely because it appears on a plan. It requires an owner, needed-by date, delivery commitment, acceptance condition, and fallback or escalation strategy.

## Procedure
1. Identify dependencies during decomposition and architecture review.
2. Classify internal, external, mandatory, optional, and sequencing dependencies.
3. Define exactly what is needed and how acceptance will be proven.
4. Assign owners on both requesting and supplying sides.
5. Agree needed-by dates and lead times.
6. Track confidence separately from nominal target dates.
7. Identify alternatives, decoupling opportunities, mocks, or staged contracts.
8. Escalate declining confidence before critical-path impact occurs.
9. Reconcile changes into schedules and risk forecasts.
10. Close only when the dependency is accepted and usable.

## Decision points
Prefer decoupling when coordination cost or uncertainty is high. Accept tighter coupling when the dependency is stable, governed, and materially simpler.

## Common failure patterns
One-sided dependency tracking, vague deliverables, no acceptance test, assuming another team's roadmap is a commitment, and discovering integration incompatibility at the end.

## Verification
Each critical dependency has bilateral ownership, explicit acceptance, current confidence, timing, and contingency or escalation path.

## Expected output
A dependency register integrated with schedule, risks, interfaces, and milestone forecasts.

## Stop conditions
Escalate when a critical dependency has no accountable supplier, no credible date, or no viable fallback.