# External Integration Rules

## Purpose
Contain failures and compatibility risk when Java services call external systems.

## Scope
Applies to HTTP clients, RPC, SDKs, third-party APIs, and internal remote dependencies.

## MUST
- Every remote call MUST have an explicit timeout budget.
- Retry policy MUST consider idempotency, failure class, attempt limits, jitter, and total request deadline.
- Connection pools and concurrency MUST be bounded according to downstream and local capacity.
- External response data MUST be treated as untrusted and validated before affecting invariants.
- Dependency contract changes MUST be compatibility-tested before rollout.

## MUST NOT
- MUST NOT retry permanent failures or non-idempotent mutations blindly.
- MUST NOT allow a slow dependency to consume unbounded threads, connections, memory, or request time.
- MUST NOT expose vendor-specific failures directly as unstable public contracts unless intentionally specified.

## SHOULD
- Use circuit breaking, bulkheads, caching, or fallback only where their failure semantics are understood.
- Propagate correlation context without leaking sensitive headers.

## Exceptions
Calls without retries or circuit breakers are valid when fail-fast semantics are safer; document the rationale.

## Verification
Use integration tests, contract tests, dependency fault injection, timeout tests, saturation tests, metrics for latency/error/pool usage, and trace inspection.