# Security and Reliability Boundaries

## Purpose
Operate production systems reliably without weakening security controls during incidents, automation, or recovery.

## When to use
Use when designing operational access, emergency procedures, secrets handling, privileged automation, or responding to incidents that cross security and availability concerns.

## Inputs
Identity model, production roles, break-glass process, secrets architecture, audit requirements, automation credentials, incident procedures, and compliance constraints.

## Preconditions
Security ownership and production authorization boundaries must be identifiable.

## Context to inspect
IAM roles, service identities, secret rotation, privileged commands, audit logs, emergency access, network boundaries, deployment credentials, and operational tooling.

## Core knowledge
Reliability does not justify bypassing least privilege, traceability, or secret protection. Emergency access should be controlled, time-bounded, audited, and recoverable. Overprivileged automation expands both security and reliability blast radius.

## Procedure
1. Map human and machine privileges required for normal operations.
2. Remove unnecessary standing administrative access.
3. Define time-bounded emergency access with strong authentication.
4. Ensure privileged actions are auditable.
5. Store and rotate secrets through approved systems.
6. Scope automation credentials to minimum required resources and actions.
7. Design incident procedures that preserve forensic evidence when relevant.
8. Test access before emergencies without exposing credentials.
9. Review failed or unusual privileged operations.
10. Coordinate security and SRE ownership for cross-domain incidents.

## Decision points
Use break-glass access only when normal paths cannot restore service within acceptable risk. Prefer managed workload identity over long-lived credentials. Preserve evidence before destructive remediation when compromise is possible.

## Common failure patterns
Shared admin accounts, secrets in runbooks, permanent emergency privileges, disabling security controls during outages, overly broad service identities, and missing audit logs.

## Verification
Confirm least-privilege access, successful secret rotation, audit visibility, emergency-access expiry, and tested incident procedures.

## Expected output
Operational access model, secure emergency process, credential controls, audit evidence, and clear security escalation boundaries.

## Stop conditions
Escalate immediately on suspected compromise, credential exposure, forensic requirements, or remediation that conflicts with security policy.