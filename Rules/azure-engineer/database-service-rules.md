# Database Service Rules

## Purpose
Operate Azure database platforms with explicit integrity, availability, performance, and recovery controls.

## Scope
Azure SQL, PostgreSQL, MySQL, Cosmos DB, Redis-compatible managed services, and database platform configuration.

## MUST
- Choose database services and tiers from workload consistency, latency, scale, recovery, and operational requirements.
- Configure backup, redundancy, authentication, and network access appropriate to data criticality.
- Validate capacity and query behavior using runtime evidence.
- Plan schema, partitioning, or indexing changes with rollback or mitigation strategies.
- Monitor saturation, throttling, storage, connections, and failure indicators relevant to the service.

## MUST NOT
- Perform destructive production database operations without verified target, recovery plan, and human approval.
- Treat higher service tiers as a substitute for query or data-model analysis.
- Expose database endpoints publicly without justified controls.

## SHOULD
- Prefer platform-native identity authentication where supported.

## Exceptions
Material deviations require owner, evidence, risk assessment, and approval.

## Verification
Review service configuration, metrics, query evidence, backup status, network settings, identity, and change records.