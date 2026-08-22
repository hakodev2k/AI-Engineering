# State Management Rules
## Purpose
Make client state predictable, minimal, and safe under concurrent UI activity.
## Scope
Local state, shared state, derived state, server state, and state transitions.
## MUST
- Distinguish server-owned data from client-owned UI state.
- Define a single authoritative owner for mutable shared state.
- Derive values from authoritative state instead of synchronizing duplicate copies where practical.
- Handle stale or concurrent updates explicitly when user actions can overlap.
## MUST NOT
- Store sensitive credentials in client state beyond the minimum mechanism required by the approved authentication design.
- Introduce global state solely to avoid deliberate component boundaries.
## SHOULD
- Keep ephemeral interaction state local and make complex transitions explicit.
## Exceptions
Duplicated state requires a synchronization invariant and tests.
## Verification
Inspect state graph, ownership, persistence, concurrent transitions, and regression tests.