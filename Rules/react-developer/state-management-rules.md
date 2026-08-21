# State Management Rules

## Purpose
Prevent unnecessary global state, inconsistent ownership, and synchronization bugs.

## Scope
Applies to local state, context, external stores, URL state, and server-state integration.

## MUST
- Every state value MUST have one authoritative owner.
- State shape MUST avoid storing values that can be reliably derived from existing state or props.
- Global/shared state MUST be introduced only when lifetime and consumer scope justify it.
- Concurrent updates MUST use APIs that preserve correctness when based on prior state.
- Persisted client state MUST define schema/version and invalidation behavior when compatibility matters.

## MUST NOT
- MUST NOT duplicate server data into unrelated client stores without an explicit synchronization strategy.
- MUST NOT place transient component state in global stores solely for convenience.
- MUST NOT mutate state objects outside supported update mechanisms.

## SHOULD
- Prefer local state by default.
- Prefer URL state for shareable navigation/filter state when appropriate.

## Exceptions
Document why normal ownership is insufficient, how consistency is maintained, and how the exception is tested.

## Verification
Review state ownership, update paths, store subscriptions, persistence behavior, and tests for concurrent or stale updates.