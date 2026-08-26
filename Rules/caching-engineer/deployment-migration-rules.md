# Deployment and Migration

## Purpose
Change cache schemas, clients, topology, and policy without uncontrolled production impact.

## Scope
Client upgrades, key migrations, cluster changes, TTL policy changes, and cache replacement.

## MUST
- Material cache changes MUST define compatibility, rollout stages, success metrics, abort criteria, and rollback.
- Incompatible key or value changes MUST support mixed application versions during deployment or explicitly coordinate downtime.
- Capacity MUST be assessed for cold-cache and rollback scenarios.
- Production topology or destructive purge changes MUST require human approval when blast radius is material.

## MUST NOT
- A migration MUST NOT assume caches are warm immediately after deployment.
- Breaking representation changes MUST NOT be released without handling old entries.
- Large purges MUST NOT be used casually as a migration shortcut.

## SHOULD
- Prefer canaries, namespace versioning, dual reads/writes where justified, and gradual traffic shifts.

## Exceptions
Require documented reason, risk, evidence, fallback, and approval.

## Verification
Review rollout plan, compatibility tests, capacity tests, dashboards, deployment records, and post-rollout validation.