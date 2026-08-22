# Backup and Recovery Rules

## Purpose
Ensure critical data and platform state can be restored after failure, corruption, or operator error.

## Scope
Applies to databases, object storage, configuration state, infrastructure state, and critical platform metadata.

## MUST
- Critical systems MUST define recovery objectives appropriate to business impact.
- Backups MUST be automated, access-controlled, monitored, and protected from the same failure domain as primary data where practical.
- Restore procedures MUST be tested on a defined cadence.
- Backup failures MUST generate actionable operational signals.
- Recovery documentation MUST identify dependencies, ordering, ownership, and verification steps.

## MUST NOT
- MUST NOT treat successful backup creation as proof that restoration works.
- MUST NOT store all backups only in the same failure domain as the source.
- MUST NOT delete recovery points without retention-policy compliance and required approval.

## SHOULD
- Prefer immutable or protected recovery copies for high-value systems.
- Measure actual restore time against objectives.

## Exceptions
Reduced recovery capability requires documented business acceptance, risk, and compensating controls.

## Verification
Review backup jobs, retention, restore-test evidence, access controls, recovery timing, integrity checks, and incident recovery records.