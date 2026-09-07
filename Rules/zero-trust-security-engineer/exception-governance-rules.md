# Exception Governance Rules

## Purpose
Prevent temporary security exceptions from becoming undocumented permanent trust paths.

## Scope
Applies to policy bypasses, legacy compatibility, weaker authentication, broad access, segmentation exceptions, and emergency controls.

## MUST
- Every exception MUST document owner, business reason, affected resources, risk, compensating controls, approval, and expiry.
- Exceptions MUST be reviewed before renewal and closed when their justification ends.
- High-risk exceptions MUST have enhanced monitoring and a remediation plan.
- Exception inventories MUST be discoverable for architecture and incident reviews.

## MUST NOT
- MUST NOT approve exceptions with indefinite duration when risk can be bounded in time.
- MUST NOT use vague reasons such as convenience or urgency without concrete operational evidence.
- MUST NOT let an AI agent approve its own authority expansion or security weakening.

## SHOULD
- Exception duration SHOULD be as short as operationally practical.
- Repeated exceptions SHOULD trigger architectural or process review.

## Exceptions
Emergency exceptions may use expedited approval but still require attribution, bounded scope, logging, and retrospective review.

## Verification
Review exception records, expiry enforcement, active bypass configuration, renewal history, remediation tracking, and samples proving expired exceptions no longer grant access.