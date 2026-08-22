# Skill: MCP Cancellation and Timeout Diagnosis

## Purpose
Diagnose stuck MCP requests without conflating user cancellation, idle timeout, absolute deadline, transport loss, or server failure.

## Trigger
Use when a tool call remains pending unexpectedly, a cancellation does not complete, the session wedges after one request, or timeout retries appear suspicious.

## Inputs
Request ID, transport/session ID, tool name, side-effect classification, start/progress/cancel timestamps, client/server logs, cancellation reason, terminal response evidence, and retry history.

## Preconditions
Logs MUST retain request correlation identifiers. Clock source SHOULD be monotonic for duration measurements. Side-effect classification MUST be known before deciding retry safety.

## Required context
Client timeout settings, server timeout settings, progress-notification behavior, transport type, reconnect behavior, and whether the request may mutate external state.

## Allowed tools
Read-only log queries, packet/HTTP traces with secrets redacted, MCP Inspector, deterministic lifecycle scripts, and local test harnesses.

## Constraints
- MUST NOT retry a side-effecting call whose outcome is unknown.
- MUST NOT treat `notifications/cancelled` as proof of terminal completion.
- MUST distinguish idle and absolute deadlines.
- MUST record ambiguous final state as `unknown`, not `failed` or `cancelled` by assumption.

## Procedure
1. Correlate the original `tools/call` with its transport/session and request ID.
2. Determine last observed state: pending, cancel requested, terminal, or unknown.
3. Identify the reason that initiated cancellation: user cancel, idle timeout, absolute timeout, transport loss, or server error.
4. Verify whether a terminal result/error was observed for the original request.
5. Measure cancel-to-terminal latency when terminal evidence exists.
6. If no terminal response exists after the configured grace period, mark the request `unknown`.
7. For read-only tools, attempt bounded reconciliation/retry only according to policy.
8. For side-effecting tools, query idempotency/status APIs if available; otherwise quarantine automatic retry.
9. Check whether later requests on the same session still complete. If not, mark session health suspect.
10. Reproduce with a controlled delayed tool and explicit cancel to validate client/server behavior.

## Decision points
- Terminal response seen: close request normally.
- Cancel grace active: wait only until grace expires.
- Unknown + read-only: bounded reconcile/retry may be allowed.
- Unknown + side effect: block automatic retry and escalate/reconcile.
- One request poisons later requests: quarantine/reconnect session after preserving state evidence.

## Expected output
A lifecycle timeline, classified cancellation cause, terminal-state status, retry eligibility, session-health decision, root-cause hypothesis, and verification plan.

## Metrics
Request age, idle duration, cancel-to-terminal latency, unknown outcome rate, session restart count, and duplicate side-effect count.

## Verification
Reproduce at least one normal completion, explicit user cancel, idle timeout, and unknown-side-effect case. Confirm each produces the expected state and retry decision.

## Failure handling
If request IDs or timestamps are missing, report diagnosis as inconclusive and improve instrumentation before changing retry policy.

## Stop conditions
Stop automatic recovery when a side-effecting request is unknown, when reconciliation attempts reach the configured maximum, or when session state cannot be trusted.
