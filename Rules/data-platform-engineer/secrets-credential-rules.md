# Secrets and Credential Rules

## Purpose
Prevent credential leakage and reduce the blast radius of compromised platform identities.

## Scope
Applies to database credentials, API keys, certificates, tokens, service credentials, encryption material, and connection secrets used by platform workloads.

## MUST
- Secrets MUST be stored and delivered through approved secret-management mechanisms rather than source code, images, configuration repositories, or logs.
- Workloads MUST receive only the credentials required for their current function and environment.
- Secret access MUST be auditable and restricted by identity and purpose.
- Rotation procedures MUST define dependency impact, validation, rollback, and emergency response.
- Production secret rotation or revocation with material outage risk MUST require explicit human approval unless an approved incident procedure authorizes emergency action.

## MUST NOT
- MUST NOT commit, echo, log, or expose secrets in job parameters, notebooks, exception messages, or telemetry.
- MUST NOT reuse production credentials in development or test environments.
- MUST NOT use long-lived static credentials when a supported short-lived workload identity provides equivalent functionality.

## SHOULD
- Prefer automatic rotation and short-lived credentials with narrowly scoped permissions.
- SHOULD scan repositories, images, logs, and artifacts for accidental secret exposure.

## Exceptions
Exceptions require technical constraint, scope, duration, risk, compensating controls, rotation plan, and security approval.

## Verification
Use secret scanners, IAM inspection, secret-store audit logs, credential-age reports, rotation tests, and configuration review.