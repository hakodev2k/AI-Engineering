# Schema Evolution
## Purpose
Prevent incompatible event changes from breaking running or replayed pipelines.
## Scope
Event schemas, serialization, compatibility, and versioning.
## MUST
- Published schemas MUST have explicit compatibility policy and ownership.
- Consumers MUST tolerate all schema versions promised by that policy.
- Breaking changes MUST use a migration/versioning strategy with producer-consumer rollout order.
## MUST NOT
- Fields MUST NOT be repurposed with changed semantics while retaining the same contract identity.
## SHOULD
- Compatibility SHOULD be validated automatically in CI against registered or canonical schemas.
## Exceptions
Emergency breaks require owner approval, blast-radius analysis, rollback, and consumer coordination.
## Verification
Run schema compatibility checks plus replay tests containing historical event versions.