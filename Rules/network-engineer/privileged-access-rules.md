# Privileged Access Rules

## Purpose
Constrain administrative authority over network infrastructure and preserve accountability.

## Scope
Device administration, controllers, consoles, cloud network control planes, automation identities, and break-glass access.

## MUST
- Grant privileged access by named identity, least privilege, business need, and approved lifecycle.
- Use MFA and centralized AAA where technically supported and appropriate.
- Separate routine user access from privileged administration.
- Review and revoke stale privileges and protect break-glass credentials with auditable controls.

## MUST NOT
- Share personal administrator accounts or use default credentials in production.
- Grant broad persistent privilege merely to simplify troubleshooting.

## SHOULD
- Use just-in-time or time-bounded privilege for sensitive operations where available.

## Exceptions
Emergency elevation requires named operator, bounded duration, reason, logging, and retrospective review.

## Verification
Inspect AAA configuration, identity assignments, privilege levels, MFA, access reviews, break-glass controls, and audit logs.