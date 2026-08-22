# Security Rules

## Purpose
Ensure reliability operations preserve confidentiality, integrity, access control, and auditability.

## Scope
Applies to operational access, secrets, production credentials, emergency procedures, automation, and diagnostic data.

## MUST
- Production access MUST follow least privilege and be attributable to an approved identity.
- Secrets MUST be stored and distributed through approved secret-management systems.
- Emergency access MUST be time-bounded where supported and audited afterward.
- Operational tooling MUST preserve authorization boundaries even during incidents.
- Security-relevant configuration changes MUST receive appropriate approval and validation.

## MUST NOT
- MUST NOT share production credentials through chat, tickets, source code, or logs.
- MUST NOT disable authentication, authorization, encryption, or audit controls merely to restore convenience.
- MUST NOT expose sensitive telemetry to unauthorized users.

## SHOULD
- Prefer short-lived credentials and role-based access.
- Review privileged access after major incidents and organizational changes.

## Exceptions
Emergency elevation requires explicit reason, bounded scope, accountable approval when feasible, and post-event audit.

## Verification
Inspect IAM policies, secret references, access logs, audit trails, privilege reviews, and emergency-access records.