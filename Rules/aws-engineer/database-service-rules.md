# Database Service Rules
## Purpose
Operate AWS database services with safe durability, performance, and change controls.
## Scope
RDS, Aurora, DynamoDB, ElastiCache persistence choices, backups, scaling, and maintenance.
## MUST
- Select database services from workload consistency, access-pattern, availability, recovery, and operational requirements.
- Validate indexes, keys, partitioning, capacity, and query patterns with representative evidence.
- Configure backups and test restore for critical databases.
- Review engine upgrades, parameter changes, and destructive schema operations for compatibility and rollback.
## MUST NOT
- Choose a database solely from familiarity when workload requirements conflict with its model.
- Execute irreversible production data changes without explicit approval and recovery planning.
## SHOULD
- Use managed capabilities when they reduce operational risk without violating requirements.
## Exceptions
Exceptions require measured evidence, risk, mitigation, owner, and approval.
## Verification
Inspect service configuration, query/capacity metrics, plans where applicable, backup restores, maintenance history, and change records.