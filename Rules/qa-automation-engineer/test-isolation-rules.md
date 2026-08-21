# Test Isolation Rules

## Purpose
Prevent hidden coupling and order-dependent automated tests.

## Scope
Applies to automated tests sharing environments, data stores, accounts, queues, files, or external resources.

## MUST
- Each test MUST establish or identify the state it requires and MUST clean up owned state when persistence can affect later runs.
- Parallel tests MUST use isolated or uniquely scoped mutable resources.
- Tests MUST be executable independently unless an explicitly modeled scenario requires sequencing.
- Shared environment constraints MUST be visible in test configuration and execution policy.

## MUST NOT
- MUST NOT depend on another test having executed first.
- MUST NOT reuse mutable test identities or records concurrently without synchronization or isolation.
- MUST NOT conceal ordering dependencies by forcing the entire suite to run serially.

## SHOULD
- Prefer generated unique data and idempotent cleanup.
- Prefer environment reset mechanisms for broad integration suites when cheaper than complex cleanup.

## Exceptions
Intentional scenario chains require documented ownership, ordering, failure semantics, and separate classification from independent regression tests.

## Verification
Run tests individually, shuffled, repeated, and in parallel where supported; inspect leaked data and cross-test failures.