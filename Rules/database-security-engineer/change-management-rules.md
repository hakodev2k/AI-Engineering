# Database Security Change Management Rules

## Purpose
Make security-sensitive database changes reviewable, controlled, and recoverable.

## Scope
Covers privileges, authentication, network exposure, encryption, auditing, security configuration, extensions, and security automation.

## MUST
- Every material security change MUST state intent, affected assets, expected impact, verification, and rollback or recovery approach.
- Production changes MUST be attributable to an approved actor and recorded through the established change mechanism.
- High-risk changes MUST be tested outside production where representative testing is feasible.
- Post-change verification MUST confirm intended behavior and check for security regression.
- Emergency changes MUST receive retrospective review.

## MUST NOT
- Security controls MUST NOT be weakened silently to unblock delivery.
- Irreversible production security changes MUST NOT be executed without explicit human approval.
- Successful deployment MUST NOT be equated with successful security outcome.

## SHOULD
- Prefer small, independently reversible changes.
- Automate policy validation and drift detection.

## Exceptions
Emergency exceptions require authorized ownership, documented necessity, bounded scope, monitoring, and follow-up remediation.

## Verification
Inspect change records, diffs, approvals, test evidence, deployment logs, effective configuration, rollback readiness, and post-change security tests.