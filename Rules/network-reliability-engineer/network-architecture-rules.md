# Network Architecture Rules

## Purpose
Protect network reliability by enforcing explicit topology, failure-domain, and dependency boundaries.

## Scope
Applies to production network topology, routing domains, connectivity patterns, shared network services, and major architectural changes.

## MUST
- Network designs MUST document critical traffic paths, trust boundaries, failure domains, and single points of failure.
- Tier-1 paths MUST have redundancy appropriate to their availability target.
- Architecture changes MUST identify expected failure modes and recovery behavior before implementation.
- Shared network dependencies MUST have explicit ownership and availability expectations.
- Significant topology changes MUST include a rollback or containment strategy.

## MUST NOT
- MUST NOT introduce hidden transitive dependencies into critical paths.
- MUST NOT rely on undocumented manual failover for critical services.
- MUST NOT collapse independent failure domains without an approved reliability trade-off.

## SHOULD
- Prefer simple, observable topology over unnecessary layering.
- Prefer designs that fail predictably and contain blast radius.

## Exceptions
Exceptions require documented constraints, alternatives considered, reliability impact, compensating controls, and approval.

## Verification
Review architecture diagrams, dependency maps, failure-mode analysis, resilience tests, and change records.