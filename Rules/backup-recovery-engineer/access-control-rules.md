# Access Control

## Purpose
Limit the blast radius of compromised identities and privileged mistakes.

## Scope
Backup consoles, repositories, service accounts, APIs, recovery environments, and privileged operations.

## MUST
- Backup administration MUST use least privilege, named accountability, and strong authentication.
- Destructive, retention-changing, or security-weakening privileges MUST be restricted to explicitly authorized roles.
- Service identities MUST have only the permissions required for their protection or recovery function.
- Privileged access MUST be logged and periodically reviewed.

## MUST NOT
- MUST NOT share persistent administrator credentials.
- MUST NOT grant production administrators unrestricted backup deletion rights by default.
- MUST NOT bypass access controls to accelerate a routine restore.

## SHOULD
- High-risk privileges SHOULD use just-in-time elevation and separation of duties where supported.
- Emergency access SHOULD be separately controlled and tested.

## Exceptions
Emergency exceptions require incident context, bounded duration, audit evidence, retrospective review, and accountable approval.

## Verification
Review role mappings, service-account permissions, MFA configuration, privileged-access logs, stale accounts, emergency access records, and periodic access certifications.