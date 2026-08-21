# Data Protection Rules

## Purpose
Protect data handled or provisioned by the platform throughout its lifecycle.

## Scope
Applies to platform state, backups, managed databases, object stores, logs, configuration data, and data-bearing shared services.

## MUST
- Data classification MUST influence access, encryption, retention, and backup controls.
- Durable platform state MUST have documented recovery expectations where loss creates material impact.
- Backup and restore procedures MUST be tested for critical state.
- Data deletion workflows MUST enforce scope validation and required approval.

## MUST NOT
- MUST NOT assume a successful backup implies recoverability without restore testing.
- MUST NOT copy sensitive production data into lower environments without approved protection.
- MUST NOT perform irreversible deletion without verifying target, authority, and recovery implications.

## SHOULD
- Prefer encryption in transit and at rest using managed mechanisms.
- Minimize retention of sensitive data not required for platform function.

## Exceptions
Alternative controls require documented risk, owner, evidence, and approval where compliance or production data is affected.

## Verification
Use restore drills, access review, encryption configuration inspection, retention checks, deletion tests, and audit logs.