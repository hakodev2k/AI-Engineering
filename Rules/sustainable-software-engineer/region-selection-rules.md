# Region Selection Rules

## Purpose
Choose deployment locations using sustainability evidence without violating latency, resilience, sovereignty, or security requirements.

## Scope
Applies to cloud regions, data centers, edge locations, and multi-region placement decisions.

## MUST
- Region selection MUST consider latency, availability, disaster recovery, data residency, service availability, cost, and environmental indicators relevant to the workload.
- Sustainability benefits MUST be supported by current provider or grid evidence where available.
- Multi-region designs MUST preserve required failure-domain independence.

## MUST NOT
- MUST NOT relocate regulated or sensitive data solely for lower-carbon operation.
- MUST NOT choose a region whose service limitations undermine required architecture controls.

## SHOULD
- Prefer lower-impact regions when functional and nonfunctional requirements are equivalent.
- Reassess placement when provider infrastructure or workload geography materially changes.

## Exceptions
Document the binding constraint, alternatives considered, impact, and accountable approval.

## Verification
Review architecture records, residency requirements, latency tests, failover design, provider-region capabilities, and sustainability data sources.
