# Database Engineer Rules

Standalone, tool-neutral constraints for AI-assisted work in this discipline. Each rule file can be copied independently; this index and sibling rules are optional navigation, not runtime dependencies.

## How to use

1. Select only the rule files relevant to the requested change and its risk.
2. Apply them with the target repository policy, explicit authorization, and the stricter safety requirement.
3. Convert important constraints into target-repository checks when deterministic enforcement is needed.
4. Keep production, destructive, privileged, financial, or externally visible actions behind the target environment's approval process.

## Rule catalogue

- [Backup and Recovery Rules](backup-recovery-rules.md)
- [Capacity Planning Rules](capacity-planning-rules.md)
- [Change Review Rules](change-review-rules.md)
- [Concurrency and Locking Rules](concurrency-locking-rules.md)
- [Configuration Change Rules](configuration-change-rules.md)
- [Data Integrity Rules](data-integrity-rules.md)
- [Data Lifecycle Rules](data-lifecycle-rules.md)
- [High Availability Rules](high-availability-rules.md)
- [Incident Response Rules](incident-response-rules.md)
- [Index Strategy Rules](index-strategy-rules.md)
- [Maintenance Rules](maintenance-rules.md)
- [Migration Safety Rules](migration-safety-rules.md)
- [Observability Rules](observability-rules.md)
- [Partitioning and Sharding Rules](partitioning-sharding-rules.md)
- [Query Performance Rules](query-performance-rules.md)
- [Replication Rules](replication-rules.md)
- [Schema Design Rules](schema-design-rules.md)
- [Database Security Rules](security-rules.md)
- [Sensitive Data Rules](sensitive-data-rules.md)
- [Database Testing Rules](testing-rules.md)
- [Transaction Rules](transaction-rules.md)
- [Database Upgrade Rules](upgrade-rules.md)

## Adoption note

Rules guide behavior but do not grant access, authority, or approval. Use the target repository's policy for ownership, secrets, and external actions.

