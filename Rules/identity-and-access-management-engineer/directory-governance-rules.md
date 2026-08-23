# Directory Governance Rules

## Purpose
Protect directory structures and identity attributes that underpin authentication and authorization.

## Scope
Enterprise directories, tenants, domains, groups, administrative units, identity attributes, and directory synchronization.

## MUST
- Directory administrative boundaries MUST be explicit and aligned to ownership and risk.
- Security-relevant attributes MUST have authoritative sources and controlled write paths.
- Group ownership MUST be identifiable and reviewed for privileged or widely used groups.
- Directory synchronization rules MUST define conflict resolution and failure behavior.
- Tenant-wide or domain-wide administrative changes MUST undergo independent review before execution.

## MUST NOT
- MUST NOT allow uncontrolled self-service modification of security-sensitive attributes.
- MUST NOT use generic shared groups as hidden administrative backdoors.
- MUST NOT make broad directory schema or synchronization changes without impact analysis and rollback preparation.

## SHOULD
- Directory delegations SHOULD be scoped to the smallest administrative boundary practical.
- Stale groups and unused administrative objects SHOULD be retired regularly.

## Exceptions
Exceptions require documented scope, owner, reason, risk, compensating controls, approval, and expiry where applicable.

## Verification
Inspect directory roles, delegated administration, sensitive-attribute ACLs, group ownership, synchronization rules, stale-object reports, and change records.