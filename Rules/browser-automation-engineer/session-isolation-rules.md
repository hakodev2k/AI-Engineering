# Session Isolation Rules

## Purpose
Prevent state leakage between browser automation runs, users, tests, and concurrent workers.

## Scope
Applies to browser contexts, profiles, cookies, local storage, session storage, IndexedDB, service workers, caches, and authenticated state.

## MUST
- Independent scenarios MUST execute with isolated session state unless shared state is an explicit part of the scenario.
- Concurrent workers MUST NOT share mutable browser profiles or authentication artifacts without a proven synchronization design.
- Session creation and teardown MUST be deterministic and failures during cleanup MUST be observable.
- Reused authenticated state MUST have defined ownership, lifetime, revocation behavior, and environment scope.
- Tests that depend on preexisting state MUST declare that dependency explicitly.

## MUST NOT
- Automation MUST NOT rely on residual cookies, storage, cached responses, or service-worker state from a previous run.
- Production credentials or production browser profiles MUST NOT be copied into automated test environments.
- Isolation MUST NOT be weakened solely to reduce runtime without measuring contamination risk.

## SHOULD
- Prefer fresh browser contexts over process-wide browser restarts when the framework provides equivalent isolation.
- Shared immutable setup SHOULD be separated from per-scenario mutable state.

## Exceptions
Stateful end-to-end scenarios may intentionally preserve state when that persistence is the behavior under test. Document boundaries, cleanup, and interference controls.

## Verification
Run scenarios in different orders and in parallel, inspect storage boundaries, repeat failed scenarios independently, and confirm no outcome depends on execution history.