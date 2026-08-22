# State Management Rules

## Purpose
Keep application state ownership, mutation, persistence, and synchronization explicit and maintainable.

## Scope
Local state, provide/inject, Pinia or equivalent stores, persisted state, and cross-feature state.

## MUST
- State MUST live at the narrowest ownership boundary that satisfies all legitimate consumers.
- Global stores MUST represent genuinely shared application or domain state, not convenience storage for local component data.
- Store mutations and actions affecting business invariants MUST preserve those invariants atomically from the UI perspective.
- Persisted client state MUST define schema/version compatibility and invalidation behavior where stale data can affect correctness.
- Sensitive state MUST be classified before deciding whether it may be persisted in browser storage.

## MUST NOT
- Stores MUST NOT become service locators for arbitrary APIs, routers, DOM objects, and unrelated feature state.
- Authentication secrets or equivalent sensitive credentials MUST NOT be persisted in insecure client storage merely for convenience.
- Components MUST NOT maintain unsynchronized copies of authoritative store state without a defined reconciliation rule.

## SHOULD
- Prefer explicit store actions for meaningful domain transitions.
- Keep store APIs stable and focused on consumer needs rather than exposing internal representation.

## Exceptions
Temporary duplicated edit state is valid when commit, cancel, conflict, and refresh semantics are explicit.

## Verification
Inspect state ownership, store consumers, persistence configuration, mutation paths, and tests for reset, refresh, and concurrent updates.