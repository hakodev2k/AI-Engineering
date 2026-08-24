# Access and Privilege Rules

## Purpose
Limit database access to authorized identities and reduce blast radius.

## Scope
Human, service, administrative, break-glass, and automation access.

## MUST
- Grant least privilege based on documented operational need.
- Separate routine application access from administrative privileges.
- Require strong authentication and auditable identity for privileged access.
- Review privileged grants and stale identities on a recurring schedule.

## MUST NOT
- Do not share personal administrative accounts.
- Do not grant broad production privileges merely to simplify troubleshooting.
- Do not leave emergency elevation active beyond the approved window.

## SHOULD
- Prefer time-bound elevation and role-based grants over permanent direct privileges.

## Exceptions
Emergency access requires incident or change authority, logging, expiry, and retrospective review.

## Verification
Inspect grants, role memberships, authentication settings, access reviews, and privileged-session evidence.