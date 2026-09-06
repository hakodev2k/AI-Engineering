# State and Long-Running Workflows

## Purpose
Design durable state for workflows that span minutes, days, external callbacks, approvals, or repeated retries.

## When to use
Use when execution cannot complete in one short synchronous transaction or when work must resume after process restarts.

## Inputs
State machine, business deadlines, external callbacks, timers, persistence options, correlation keys, cancellation rules, and retention requirements.

## Context to inspect
Inspect workflow-engine persistence, execution history, callback patterns, scheduler durability, cleanup behavior, and existing stuck executions.

## Core knowledge
Long-running workflows should model explicit business states and transitions rather than depending on in-memory execution context. Durable correlation and deterministic transition rules enable restart and recovery.

## Procedure
1. Enumerate meaningful business states and terminal outcomes.
2. Define allowed transitions and transition triggers.
3. Choose stable correlation identifiers.
4. Persist state before relying on future callbacks or timers.
5. Separate business state from transient runtime metadata.
6. Define deadlines, expiry, cancellation, and abandonment behavior.
7. Make transitions idempotent under duplicate callbacks.
8. Record enough history for diagnosis without retaining unnecessary sensitive data.
9. Define recovery for stuck or orphaned states.
10. Test restart at every major state transition.
11. Define retention and archival for completed executions.

## Decision points
Use a durable workflow engine when timers, callbacks, or orchestration state are complex. Use simple database-backed state for modest flows with clear transitions. Avoid holding database transactions across external waits.

## Common failure patterns
Long sleeps in workers, state only in memory, ambiguous terminal states, non-idempotent callbacks, indefinite retention, and workflows that cannot be cancelled safely.

## Verification
Restart workers during waits and transitions, replay callbacks, expire timers, and confirm deterministic recovery and final state.

## Expected output
A durable state model with transitions, persistence, correlation, deadlines, cancellation, recovery, and retention.

## Stop conditions
Stop when the platform cannot durably persist required state or when business transition semantics are unresolved.