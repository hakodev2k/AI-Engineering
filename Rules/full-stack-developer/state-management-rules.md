# State Management Rules

## Purpose
Keep application state ownership predictable across client and server.
## Scope
Local UI state, shared client state, server state, caches, and persisted state.
## MUST
- Define a single authoritative owner for each state category.
- Treat server-derived cached state as potentially stale and define invalidation behavior.
- Keep transient UI state separate from durable business state.
## MUST NOT
- Create multiple writable sources of truth without synchronization semantics.
- Persist sensitive state client-side without security review.
## SHOULD
- Keep state as local as practical and derive values instead of duplicating them.
## Exceptions
Duplicated state requires documented synchronization and failure behavior.
## Verification
Review data-flow diagrams, state transitions, cache tests, and stale-data scenarios.