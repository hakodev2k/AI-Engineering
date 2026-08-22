# Skill: Tool-Call Integrity Analysis

## Purpose
Diagnose whether streamed tool calls can cross from transport parsing into execution before completeness, authorization, and commit status are proven.

## Trigger
Use after malformed/truncated tool-call incidents, provider adapter changes, session-resume failures, or before exposing a new side-effecting tool.

## Inputs
Raw sanitized stream events, assembled tool-call envelope, tool schema, authorization policy, execution logs, postcondition evidence, and provider finish/terminal semantics.

## Preconditions
Preserve raw event ordering and distinguish model generation from tool execution. Redact secrets without deleting structural evidence needed to reproduce the bug.

## Allowed tools
Log inspection, deterministic parsers, schema validators, test runners, local fixtures, and read-only repository inspection.

## Constraints
- Never execute a partial call during analysis.
- Never repair malformed arguments by silently substituting defaults.
- Never retry a side-effecting call when execution outcome is unknown.

## Procedure
1. Reconstruct the call lifecycle from first delta through terminal event or interruption.
2. Record when call ID, tool name, arguments, finish reason, and schema-valid state became known.
3. Identify the earliest point the execution layer could receive the call.
4. Verify that `partial` and `complete` states are represented distinctly.
5. Validate arguments against the actual tool schema only after terminal assembly.
6. For side effects, verify authorization and idempotency key before execution.
7. After execution, obtain deterministic postcondition evidence where feasible.
8. If connection/worker failure makes execution outcome unknown, reconcile external state before any retry.
9. Add adversarial fixtures for missing ID/name, truncated JSON, empty-object substitution, interrupted history, unknown outcome, and duplicate retry.
10. Run `scripts/tool_call_gate.py` and integration tests.

## Decision points
- Missing terminal evidence → wait/partial, never execute.
- Complete but schema-invalid/unauthorized → deny and return a structured repair error.
- Unknown side-effect outcome → reconcile, never blind retry.
- Complete, authorized, schema-valid call → ready.

## Expected output
Lifecycle timeline, failure boundary, root cause, integrity-gate decision, recovery plan, regression tests, and verification record.

## Metrics
Incomplete executions, schema-invalid executions, duplicate side effects, unknown outcomes reconciled, false blocks of valid calls.

## Verification
All adversarial cases must fail closed or reconcile, and valid complete fixtures must remain executable.

## Failure handling
If raw stream/order evidence is unavailable, classify the incident as unverified and disable unattended retry for the affected side-effect path until telemetry is restored.

## Stop conditions
Stop when execution preconditions are deterministic, adversarial tests pass, and independent verification finds no path from partial state to side effect.
