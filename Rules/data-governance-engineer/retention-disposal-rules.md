# Retention and Disposal Rules
## Purpose
Retain data for justified periods and dispose of it safely when obligations end.
## Scope
Primary data, replicas, exports, archives, backups, and derived governed datasets.
## MUST
- Retention periods MUST map to business, legal, contractual, and regulatory requirements.
- Disposal MUST be controlled, auditable, and appropriate to storage technology and classification.
- Legal holds or equivalent preservation requirements MUST override normal deletion schedules.
## MUST NOT
- Data MUST NOT be retained indefinitely by default.
- Destructive disposal of production or regulated data MUST NOT execute without required human approval.
## SHOULD
- Retention SHOULD be enforced automatically and tested for all material storage tiers.
## Exceptions
Extended retention requires documented purpose, risk, owner, expiry, and approval.
## Verification
Inspect retention schedules, deletion jobs, hold records, disposal evidence, backup behavior, and exception registers.