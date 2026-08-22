# Availability and Resilience Rules

## Purpose
Align redundancy, failover, and recovery design with real business availability needs.

## Scope
Covers zones, regions, load balancing, failover, backup, disaster recovery, and dependency resilience.

## MUST
- Availability architecture MUST map to defined SLOs and failure domains.
- Failover mechanisms MUST be tested and must define state, DNS, connection, and dependency implications.
- Backups MUST have verified restore procedures; backup existence alone is not sufficient.
- Disaster recovery MUST define RTO, RPO, ownership, activation criteria, and communication path.
- Multi-region or multi-zone designs MUST account for data consistency and operational complexity.

## MUST NOT
- MUST NOT add geographic redundancy without evaluating cost, data residency, consistency, and operational burden.
- MUST NOT claim DR readiness without restore/failover evidence.
- MUST NOT rely on one dependency whose outage invalidates the stated availability target without explicit acceptance.

## SHOULD
- Prefer automated, regularly exercised recovery for critical services.
- Keep recovery procedures simple enough to execute under incident pressure.

## Exceptions
Lower-tier systems may use restore-based recovery when business impact permits.

## Verification
Review failover tests, restore evidence, dependency maps, SLO calculations, runbooks, recovery drills, and post-test findings.