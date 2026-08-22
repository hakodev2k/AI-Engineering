# Architecture Review

## Purpose
Evaluate an architecture against its actual requirements, risks, and operational context using evidence rather than personal pattern preference.

## When to use
Use before major commitments, production launch, substantial change, migration, or after recurring incidents reveal systemic concerns.

## Inputs
Requirements, NFRs, diagrams, ADRs, threat model, data design, deployment model, test evidence, operational plan.

## Preconditions
Current architecture artifacts are available and review scope is explicit.

## Context to inspect
Critical journeys, dependencies, failure domains, identity, data, scalability, observability, recovery, cost, operational ownership.

## Core knowledge
Architecture review should focus on material risks and mismatches between design and drivers. Checklist findings should be prioritized by impact, not count.

## Procedure
1. Restate business goals and top architecture drivers.
2. Validate system boundaries and dependencies.
3. Review major decisions and alternatives.
4. Walk critical scenarios end to end.
5. Walk failure and recovery scenarios.
6. Review security and trust boundaries.
7. Review data ownership and consistency.
8. Review capacity, performance, and cost assumptions.
9. Review observability and operational readiness.
10. Classify findings by severity, evidence, owner, and required action.

## Decision points
Block only on risks that materially violate requirements or accepted policy. Record advisory improvements separately.

## Common failure patterns
Pattern policing, superficial checklist reviews, undocumented severity, redesigning everything, reviewing diagrams without runtime evidence.

## Verification
Critical findings have owners and closure evidence; accepted risks are explicit.

## Expected output
Risk-focused architecture review with prioritized actions.

## Stop conditions
Stop when current design or requirements are too incomplete to assess material risk.