# Secrets Management Rules

## Purpose
Protect credentials, keys, certificates, and sensitive configuration throughout delivery and operations.

## Scope
Applies to CI/CD, cloud resources, runtime configuration, repositories, and operator workflows.

## MUST
- Secrets MUST be stored in approved secret-management systems with access controls and auditability.
- Secret access MUST follow least privilege and workload identity SHOULD replace static credentials when possible.
- Rotation procedures MUST be defined for production-critical secrets.
- Logs, artifacts, crash dumps, and support bundles MUST be checked for secret exposure.

## MUST NOT
- MUST NOT commit secrets to source control, images, templates, or plain-text configuration.
- MUST NOT share production secrets through chat, tickets, or unsecured documents.
- MUST NOT disable scanning because a secret is inconvenient to rotate.

## SHOULD
- Prefer short-lived credentials, managed identity, and automated rotation.
- Prefer environment isolation so credentials cannot cross trust boundaries unnecessarily.

## Exceptions
Legacy static credentials require documented owner, expiry plan, monitoring, and compensating controls.

## Verification
Use secret scanners, access-policy review, audit logs, rotation evidence, repository history inspection, and runtime configuration checks.