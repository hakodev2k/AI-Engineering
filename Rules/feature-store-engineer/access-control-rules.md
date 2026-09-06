# Access Control Rules

## Purpose
Enforce least privilege for feature discovery, historical retrieval, materialization, and online serving.

## Scope
User identities, service identities, feature groups, stores, registries, and administrative operations.

## MUST
- Access MUST be granted by authenticated identity and explicit authorization policy.
- Service identities MUST receive only permissions required for their workload.
- Sensitive feature groups MUST support finer-grained access controls where risk requires them.
- Administrative and production-write privileges MUST be auditable.
- Access changes that materially expand production privileges MUST require approval.

## MUST NOT
- MUST NOT use shared long-lived credentials as the normal access mechanism.
- MUST NOT bypass feature-store authorization through direct storage access without governed exception.
- MUST NOT expose privileged credentials in code, logs, notebooks, or configs.

## SHOULD
- Prefer workload identity and short-lived credentials.
- Periodically review privileged access.

## Exceptions
Break-glass access requires incident justification, time bounds, logging, and post-event review.

## Verification
Inspect IAM policies, credential configuration, audit logs, access reviews, and unauthorized-access tests.