# Reliability Strategy

## Purpose
Define reliability priorities and engineering investments across multiple systems using business impact, SLOs, failure history, and operational cost.

## When to use
Use when incidents span teams, reliability work competes with feature work, SLOs are inconsistent, or resilience requires coordinated investment.

## Inputs
SLOs, incident history, dependency maps, traffic profiles, business criticality, error budgets, operational toil, recovery objectives.

## Preconditions
Critical user journeys and service owners are identifiable.

## Context to inspect
Availability and latency trends, recurring incidents, dependencies, capacity limits, backup/restore posture, deployment failures, observability gaps, and escalation paths.

## Core knowledge
Reliability is an economic trade-off. Optimize user-visible reliability, not isolated component uptime. Error budgets, graceful degradation, redundancy, recovery design, and operational simplicity guide investment.

## Procedure
1. Rank critical user journeys by impact.
2. Map supporting dependencies and failure domains.
3. Review SLOs and actual performance.
4. Identify dominant reliability risks from incidents and architecture.
5. Separate prevention, detection, mitigation, and recovery opportunities.
6. Estimate cost and expected risk reduction.
7. Prioritize cross-team reliability investments.
8. Define ownership, milestones, and measurable outcomes.
9. Establish recurring review using error-budget and incident evidence.

## Decision points
Prefer removing common failure modes before adding redundancy blindly. Use stronger availability patterns only where business requirements justify operational cost.

## Common failure patterns
Uniform SLOs for all services, redundancy without tested failover, ignoring dependency reliability, alert-heavy strategies, and reliability projects without measurable outcomes.

## Verification
Confirm SLO coverage, tested recovery paths, reduced incident recurrence, and measurable improvement in user-facing reliability.

## Expected output
A prioritized reliability strategy with critical journeys, risks, investments, owners, and success metrics.

## Stop conditions
Escalate when required reliability exceeds feasible cost or architectural constraints require executive product trade-offs.