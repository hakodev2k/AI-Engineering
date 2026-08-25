# Incident Response Rules
## Purpose
Restore PostgreSQL service safely while preserving evidence and data correctness.
## Scope
Outages, corruption suspicion, saturation, lock storms, replication failures, and recovery actions.
## MUST
- Prioritize data integrity and blast-radius containment alongside service restoration.
- Record timestamps, symptoms, actions, and evidence during significant incidents.
- Validate recovery using database and application signals before declaring resolution.
- Require authorized human control for destructive recovery actions.
## MUST NOT
- Delete evidence or perform speculative destructive changes to make symptoms disappear.
- assume a restarted database has resolved the root cause.
## SHOULD
- Prefer reversible mitigations before invasive repair.
## Exceptions
Immediate safety actions may precede full diagnosis when delay increases harm; rationale must be recorded.
## Verification
Review incident timeline, logs, metrics, integrity checks, recovery tests, and follow-up actions.