# Signals and Reactive State Rules

## Purpose
Keep Angular reactive state explicit, derived correctly, and free from accidental synchronization bugs.

## Scope
Signals, computed values, effects, RxJS interop, local state, and shared reactive state.

## MUST
- Identify the authoritative owner for every mutable state value.
- Derive state with `computed` or equivalent pure derivation instead of synchronizing duplicate mutable copies.
- Use effects for genuine side effects, not as a substitute for declarative derivation.
- Define lifecycle and cleanup when bridging signals, Observables, browser APIs, or external resources.

## MUST NOT
- Create feedback loops between effects and writable state.
- Store the same authoritative value independently in multiple reactive stores without a synchronization contract.
- Hide asynchronous failure or completion semantics during signal/Observable conversion.

## SHOULD
- Keep writable state private and expose readonly views where external mutation is not part of the contract.

## Exceptions
Duplicated state for optimistic UX or offline operation requires explicit reconciliation, conflict, and rollback behavior.

## Verification
Inspect state ownership, computed dependencies, effects, interop cleanup, and tests covering updates, errors, and teardown.