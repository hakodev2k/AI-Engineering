# Security and Privacy Rules

## Purpose
Protect inference infrastructure, model artifacts, credentials, tenants, and request data from unauthorized access or disclosure.

## Scope
Applies to authentication, authorization, network exposure, secrets, request data, model artifacts, tenant isolation, and administrative interfaces.

## MUST
- Inference endpoints MUST authenticate callers where anonymous access is not explicitly intended.
- Authorization MUST enforce tenant, model, feature, and administrative boundaries appropriate to the system.
- Secrets MUST be stored in approved secret-management systems and delivered with least privilege.
- Sensitive request data MUST be minimized, protected in transit and at rest where persisted, and subject to documented retention.
- Administrative and model-management interfaces MUST have stronger access controls than ordinary inference traffic.
- Security-sensitive configuration changes MUST be auditable.
- Multi-tenant execution MUST validate isolation across queues, caches, logs, artifacts, and metrics.

## MUST NOT
- MUST NOT embed credentials in source code, model artifacts, container images, or deployment manifests.
- MUST NOT log authentication tokens, private prompts, or sensitive outputs by default.
- MUST NOT weaken authentication, authorization, encryption, or isolation controls merely to unblock deployment.
- MUST NOT expose internal model-management ports publicly without explicit security review.

## SHOULD
- Network access SHOULD be restricted to required callers and dependencies.
- Privileged operations SHOULD use short-lived credentials and separation of duties.

## Exceptions
Security exceptions require a documented threat, compensating controls, expiration date, verification plan, and authorized human approval.

## Verification
Inspect IAM policies, network configuration, secret references, logs, retention settings, isolation tests, vulnerability scans, and audit records.