# Security and Access Rules

## Purpose
Protect stream infrastructure and event data using least privilege and secure defaults.

## Scope
Applies to authentication, authorization, network access, encryption, credentials, and administrative operations.

## MUST
- Producers, consumers, and operators MUST authenticate using managed identities or securely stored credentials appropriate to the platform.
- Authorization MUST grant only required stream, group, schema, and administrative actions.
- Sensitive event data MUST be protected in transit and at rest according to classification requirements.
- Administrative and cross-environment access MUST be auditable.
- Credential rotation and revocation MUST be supported without unsafe service-wide outages.

## MUST NOT
- MUST NOT embed credentials in source, images, event payloads, or logs.
- MUST NOT grant wildcard administrative privileges to application identities without documented necessity.
- MUST NOT weaken TLS, authentication, or authorization controls merely to resolve connectivity problems.
- MUST NOT share production credentials with non-production workloads.

## SHOULD
- Separate identities SHOULD be used per workload and environment.
- Network exposure SHOULD be minimized and private connectivity preferred where justified.

## Exceptions
Elevated access requires time-bounded approval, reason, scope, auditability, and revocation plan.

## Verification
Review IAM/ACL configuration, credential sources, TLS settings, network policy, audit logs, secret scans, and negative authorization tests.