# Registry Access Rules

## Purpose
Protect container registries and image distribution channels from unauthorized publication, substitution, and exfiltration.

## Scope
Applies to registry authentication, repository permissions, push/pull access, retention, immutability, and promotion workflows.

## MUST
- Registry permissions MUST enforce least privilege separately for image producers, promoters, and consumers.
- Production repositories MUST prevent unauthorized overwrite or deletion of approved artifacts.
- CI/CD identities that push images MUST be distinct from ordinary runtime identities that only pull images.
- Registry access MUST be authenticated and encrypted in transit.
- Audit logs MUST capture security-relevant publish, delete, permission, and promotion events where supported.

## MUST NOT
- MUST NOT grant broad registry administration to application workloads.
- MUST NOT share long-lived registry credentials across unrelated pipelines or environments.
- MUST NOT allow production promotion based solely on a mutable tag transition when immutable artifact identity is available.

## SHOULD
- Use repository-level or path-level authorization and short-lived workload credentials.
- Enable retention and immutability controls consistent with rollback and audit requirements.

## Exceptions
Broader access requires documented operational need, scope, duration, monitoring, and approval.

## Verification
Inspect IAM policies, token scopes, registry settings, audit events, retention policy, and deployment pull identities.