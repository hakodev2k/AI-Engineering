# Network Architecture Rules

## Purpose
Protect scalable, supportable network architecture and explicit trust boundaries.

## Scope
Enterprise, cloud, hybrid, campus, data-center, and service networks.

## MUST
- Document traffic flows, trust zones, routing boundaries, dependencies, failure domains, and capacity assumptions before material design changes.
- Design redundant paths so a declared single failure does not violate agreed availability objectives.
- Assign ownership for shared network services and boundaries.
- Record significant architecture decisions, constraints, alternatives, and rollback implications.

## MUST NOT
- Introduce hidden transitive connectivity or undocumented critical dependencies.
- Treat diagram-level redundancy as proof of end-to-end resilience.

## SHOULD
- Prefer simple, standardized topology patterns over bespoke designs when requirements are equivalent.

## Exceptions
Deviations require documented need, risk, evidence, compensating controls, and accountable approval.

## Verification
Review current diagrams, routing policy, failure-domain analysis, dependency inventory, and resilience-test evidence.