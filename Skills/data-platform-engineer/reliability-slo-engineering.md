# Reliability and SLO Engineering

## Purpose
Define and operate reliability targets for data-platform services and datasets using measurable user outcomes, error budgets, and failure-domain analysis.

## When to use
Use for production platform capabilities, critical datasets, reliability reviews, and prioritization between feature work and resilience.

## Inputs
Consumer expectations, incident data, dependency SLAs, recovery objectives, workload criticality, and telemetry.

## Context to inspect
Availability/freshness history, failure domains, retry behavior, capacity margins, runbooks, DR design, and operational ownership.

## Core knowledge
SLOs are internal reliability targets, not aspirational 100% promises. Error budgets quantify tolerated unreliability. Data systems often need freshness and correctness SLOs in addition to service availability.

## Procedure
1. Identify critical user journeys and datasets.
2. Define measurable SLIs and observation windows.
3. Set targets from business impact and achievable architecture.
4. Model dependency reliability and correlated failure domains.
5. Establish error-budget policy and escalation thresholds.
6. Prioritize resilience work by risk reduction.
7. Define RTO/RPO for stateful components and data products.
8. Exercise recovery procedures.
9. Review SLO misses for systemic improvements.
10. Recalibrate targets when workload or business criticality changes.

## Decision points
Use stricter targets only when business value justifies cost and complexity. Multi-region designs are warranted for failure objectives that a single region cannot satisfy; otherwise they may add more failure modes than value.

## Common failure patterns
100% targets, infrastructure-only SLIs, ignoring dependency correlation, no error-budget consequences, untested recovery, and treating every dataset as equally critical.

## Verification
Calculate SLOs from production telemetry, simulate dependency failures, execute recovery, validate RTO/RPO, and verify error-budget policy drives concrete actions.

## Expected output
SLIs/SLOs, error-budget policy, dependency risk model, recovery objectives, resilience backlog, and tested runbooks.

## Stop conditions
Stop when business owners cannot define acceptable impact, telemetry cannot measure the proposed SLI, or resilience changes require unapproved cross-region or destructive operations.