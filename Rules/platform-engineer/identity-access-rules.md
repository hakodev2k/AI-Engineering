# Identity and Access Rules

## Purpose
Protect platform and workload access through explicit identity boundaries and least privilege.

## Scope
Applies to human users, workloads, service accounts, federated identities, platform services, and administrative access.

## MUST
- Access MUST be granted to named identities or managed workload identities with least privilege.
- Privileged access MUST be time-bounded or strongly controlled where the environment supports it.
- Authorization decisions MUST be enforced server-side at trusted boundaries.
- Access changes MUST be auditable.

## MUST NOT
- MUST NOT share long-lived administrator credentials between users or services.
- MUST NOT embed credentials in templates, images, source code, or logs.
- MUST NOT rely on UI hiding as authorization.

## SHOULD
- Prefer short-lived federated credentials over static secrets.
- Periodically review privileged and inactive access.

## Exceptions
Emergency access requires explicit approval, narrow scope, audit evidence, and prompt revocation.

## Verification
Inspect IAM policies, role bindings, access logs, secret scans, identity configuration, and authorization tests.