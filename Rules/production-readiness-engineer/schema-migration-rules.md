# Schema Migration Rules
## Purpose
Ensure schema changes are compatible, observable, and recoverable.
## Scope
Relational schemas, document structures, indexes, constraints, partitioning, and storage metadata.
## MUST
- Migrations MUST be evaluated for backward and forward compatibility with deployed versions.
- Locking, runtime, resource use, and replication effects MUST be assessed for production-scale data.
- Destructive or irreversible changes MUST require approved sequencing and recovery strategy.
- Expand-migrate-contract sequencing MUST be used when simultaneous compatibility cannot be guaranteed.
- Migration completion MUST be verified using schema and data evidence.
## MUST NOT
- Zero-downtime behavior MUST NOT be assumed without validating engine and workload characteristics.
- Fields or structures MUST NOT be removed while active consumers may depend on them.
- Small development databases MUST NOT be used as sole evidence of production migration safety.
## SHOULD
- Test long-running migrations against production-like scale.
- Separate compatibility changes from destructive cleanup.
## Exceptions
Compatibility deviations require documented impact, recovery plan, rollout constraints, and approval.
## Verification
Inspect migration scripts, lock analysis, compatibility tests, scale estimates, rollout sequence, and approvals.