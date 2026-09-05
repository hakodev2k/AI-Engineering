# Production Change Safety Rules

## Purpose
Control high-risk messaging changes so they are reviewed, reversible, and supported by evidence.

## Scope
Broker upgrades, partition changes, retention changes, ACLs, quotas, routing, schema policy, topic deletion, offset resets, and production configuration.

## MUST
- Production changes MUST have an explicit scope, expected effect, verification plan, and rollback or recovery strategy.
- Destructive operations, security weakening, offset resets, topic/queue deletion, retention reductions, and breaking contract changes MUST require explicit human approval.
- High-risk changes MUST be staged or bounded where the platform permits.
- Post-change verification MUST inspect both platform health and affected producer/consumer behavior.
- AI agents MUST distinguish analysis, recommendation, preparation, and execution and MUST NOT exceed granted authority.

## MUST NOT
- MUST NOT force changes through by disabling security, durability, or replication controls without approval.
- MUST NOT rewrite Git history or conceal change evidence.
- MUST NOT declare success before required verification completes.

## SHOULD
- Prefer small, reversible, independently observable changes.

## Exceptions
Emergency changes require incident authority, minimized blast radius, audit trail, and post-event review.

## Verification
Inspect change records, approvals, diffs, broker audit logs, rollout metrics, and rollback evidence.