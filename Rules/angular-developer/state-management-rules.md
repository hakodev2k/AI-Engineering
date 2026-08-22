# State Management Rules

## Purpose
Choose state-management scope and tooling based on ownership, lifetime, complexity, and evidence rather than fashion.

## Scope
Component state, feature services, signals, RxJS stores, global stores, server cache, and persisted state.

## MUST
- Classify state by owner, lifetime, persistence, sharing, and source of truth before selecting a store pattern.
- Keep server-owned data distinct from client-only UI state and define invalidation/reconciliation behavior.
- Make mutations explicit and observable enough to debug critical workflows.
- Define reset behavior for user/session changes when state may contain user-specific data.

## MUST NOT
- Promote local state to global scope solely for convenient access.
- Persist sensitive state without a security and lifecycle requirement.
- Duplicate server cache and global state without an ownership/invalidation contract.

## SHOULD
- Use the simplest state mechanism that preserves correctness and maintainability for the feature's actual complexity.

## Exceptions
Optimistic/offline state may temporarily diverge from server truth when conflict resolution and rollback are explicit.

## Verification
Review state diagrams/ownership, mutation paths, session reset tests, cache invalidation tests, and debugging evidence.