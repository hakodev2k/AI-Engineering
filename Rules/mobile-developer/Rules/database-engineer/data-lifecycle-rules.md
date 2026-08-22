# Data Lifecycle Rules
## Purpose
Control creation, retention, archival, legal holds, and deletion of persistent data.
## Scope
Operational tables, history, archives, partitions, retention jobs, and deletion workflows.
## MUST
- Define retention and deletion requirements with accountable business, legal, or security owners where applicable.
- Make deletion workflows auditable and validate scope before execution.
- Account for replicas, backups, caches, exports, and derived copies in lifecycle design.
## MUST NOT
- Delete production data based on an unreviewed ad hoc predicate.
- Retain data indefinitely merely because storage is available.
## SHOULD
- Automate lifecycle enforcement with dry-run or preview capability for risky operations.
## Exceptions
Retention deviations require basis, owner, expiry, and approval.
## Verification
Inspect policies, deletion previews, row counts, audit records, archive restores, and downstream-copy handling.