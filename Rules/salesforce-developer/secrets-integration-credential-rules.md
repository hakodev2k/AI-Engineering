# Secrets and Integration Credential Rules

## Purpose
Protect credentials and integration trust boundaries.

## Scope
Applies to named credentials, external credentials, connected apps, certificates, tokens, and integration secrets.

## MUST
- Secrets MUST be stored in approved platform secret or credential mechanisms.
- Integration identities MUST use least privilege and separate non-production from production access.
- Credential rotation MUST have a tested rollover plan when downtime or authentication failure is possible.
- Secret exposure incidents MUST trigger containment and rotation procedures.

## MUST NOT
- MUST NOT store secrets, tokens, private keys, or passwords in Apex, metadata text fields, source control, logs, or test fixtures.
- MUST NOT reuse production credentials in lower environments.
- MUST NOT weaken authentication controls without explicit human approval.

## SHOULD
- Short-lived credentials SHOULD be preferred when supported.
- Integration permissions SHOULD be reviewed periodically.

## Exceptions
Exceptions require security approval, documented compensating controls, expiry, and review date.

## Verification
Inspect credential configuration, repository scans, permission assignments, rotation evidence, and environment separation.