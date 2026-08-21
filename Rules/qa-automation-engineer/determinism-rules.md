# Determinism Rules

## Purpose
Ensure repeated automation produces trustworthy, reproducible outcomes.

## Scope
Applies to timing, randomness, asynchronous behavior, clocks, networks, and external dependencies in tests.

## MUST
- Tests MUST wait for observable conditions rather than arbitrary elapsed time when synchronization is possible.
- Random inputs MUST be reproducible from recorded seeds or equivalent evidence when failures depend on them.
- Time-sensitive tests MUST control or explicitly bound clock assumptions.
- Nondeterministic dependencies MUST have defined stabilization or failure-handling strategies.

## MUST NOT
- MUST NOT use fixed sleeps as the primary synchronization mechanism.
- MUST NOT pass intermittently without investigation merely because retries eventually succeed.
- MUST NOT depend on unspecified collection order, network timing, or scheduler behavior.

## SHOULD
- Prefer event, response, state, or condition-based synchronization.
- Prefer deterministic fakes for dependencies when the integration itself is not under test.

## Exceptions
A timing delay may be used only when no observable synchronization exists and the rationale, bound, and flakiness risk are documented.

## Verification
Repeat tests under load, vary execution order and timing, inspect retry history, and reproduce failures from captured seeds and timestamps.