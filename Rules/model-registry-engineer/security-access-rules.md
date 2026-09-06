# Security and Access Rules

## Purpose
Protect model artifacts, metadata, lifecycle actions, and registry administration using least privilege and auditable identity.

## Scope
Authentication, authorization, service identities, administrative operations, artifact access, and secret handling.

## MUST
- Registry access MUST require authenticated identities.
- Write, promote, archive, delete, and administrative permissions MUST be explicitly authorized.
- Service identities MUST receive only permissions required by their workflows.
- Privileged changes MUST be auditable to an accountable identity.
- Secrets used by registry integrations MUST be stored in approved secret-management systems.

## MUST NOT
- MUST NOT embed credentials in model metadata, artifact packages, source code, or logs.
- MUST NOT use shared administrator credentials as the normal operating model.
- MUST NOT bypass registry authorization through direct artifact-store access without a governed exception.

## SHOULD
- Prefer short-lived workload credentials.
- Periodically review privileged access and dormant identities.

## Exceptions
Emergency access requires authorized context, time bounds, audit logging, and post-event review.

## Verification
Inspect IAM policy, service identities, audit logs, secret configuration, and negative authorization tests.