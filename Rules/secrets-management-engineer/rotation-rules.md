# Secret Rotation Rules

## Purpose
Limit credential exposure duration while preserving service continuity.

## Scope
Scheduled, event-driven, emergency, and cryptoperiod-driven rotation.

## MUST
- Rotation frequency MUST reflect credential privilege, exposure, issuer capability, and recovery cost.
- Rotation MUST define issuance, distribution, activation, overlap where needed, validation, old-credential revocation, and rollback behavior.
- Automated rotation MUST verify consumer health before declaring completion.
- Suspected compromise MUST trigger event-driven rotation or revocation independent of the normal schedule.

## MUST NOT
- Rotation MUST NOT leave the previous credential valid indefinitely.
- Production rotation MUST NOT rely on an untested manual sequence for critical credentials.
- Rotation success MUST NOT be inferred solely from successful secret creation.

## SHOULD
- Prefer zero-downtime dual-credential or staged rotation where supported.
- Rotation SHOULD be automated and observable for frequently used credentials.

## Exceptions
Extended cryptoperiods require documented constraints, risk assessment, compensating controls, approval, and a review date.

## Verification
Review rotation timestamps, job results, consumer telemetry, revoked versions, failure alerts, and recovery tests. Sample credentials to confirm old material no longer authenticates.