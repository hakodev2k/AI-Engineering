# Disaster Recovery

## Purpose
Ensure database recovery objectives are achievable after catastrophic failures.

## Scope
Backups, restore, cross-region recovery, point-in-time recovery, archival, and disaster procedures.

## MUST
- Recovery design MUST map to approved RTO and RPO targets.
- Backups MUST be restorable, integrity-checked, protected from routine administrative compromise, and retained according to policy.
- Recovery procedures MUST identify dependencies, sequencing, validation, and communication ownership.
- Restore tests MUST use production-representative scale and include application-level validation.

## MUST NOT
- MUST NOT treat backup completion as proof of recoverability.
- MUST NOT store all recovery copies in the same failure or trust domain.
- MUST NOT change retention or delete recovery assets without required approval.

## SHOULD
- Prefer automated, repeatable restoration with documented manual fallback.
- Recovery exercises SHOULD measure actual RTO and data loss against targets.

## Exceptions
Exceptions require risk acceptance, duration, compensating controls, and accountable approval.

## Verification
Review backup logs, restore drill evidence, retention configuration, recovery runbooks, and measured RTO/RPO outcomes.