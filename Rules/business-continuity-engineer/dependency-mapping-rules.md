# Dependency Mapping Rules

## Purpose
Make hidden dependencies visible before disruptions expose them.

## Scope
Applies to people, processes, applications, data, infrastructure, facilities, suppliers, utilities, and external services required by critical capabilities.

## MUST
- Critical capabilities MUST document upstream and downstream dependencies, including dependency owners and recovery assumptions.
- Dependency maps MUST identify single points of failure and dependencies whose recovery objectives are weaker than the consuming service requires.
- Cross-domain dependencies MUST be reviewed with the accountable owners of both sides.
- Material dependency changes MUST trigger continuity impact review.

## MUST NOT
- MUST NOT assume a dependency is resilient merely because it is managed by another team or provider.
- MUST NOT omit manual, human, facility, or external dependencies from continuity analysis.

## SHOULD
- Model dependency chains far enough to expose correlated and cascading failure risks.
- Prefer evidence from architecture records, service catalogs, telemetry, contracts, and exercises over memory alone.

## Exceptions
Any intentionally unmodeled dependency requires documented scope, rationale, risk, owner, and review date.

## Verification
Review dependency maps against service catalogs, architecture diagrams, supplier inventories, operational telemetry, exercise findings, and owner attestations.
