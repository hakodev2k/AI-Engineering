# Skill: MCP Lifecycle Diagnosis
## Purpose
Separate transient transport failures, protocol incompatibility, and stale process-state observations before declaring an MCP server unavailable.

## Trigger
Initialization error, unexpected post-discovery failure, reconnect storm, or session-long missing tools.

## Inputs
Transport, phase, attempt count, HTTP status/error code, process liveness, health probe, timing metrics.

## Preconditions
A baseline event trace exists or can be captured without destructive actions.

## Required context
Only lifecycle telemetry and server configuration.

## Allowed tools
Read-only logs, non-mutating health probes, `scripts/lifecycle_guard.py`.

## Constraints
MUST NOT retry indefinitely. MUST NOT convert authentication/protocol errors into generic retries.

## Procedure
1. Capture baseline time-to-ready and failure class.
2. Normalize the lifecycle event.
3. Evaluate with the deterministic state machine.
4. If stdio state is contradictory, perform one non-mutating health probe.
5. Retry only if classified transient and within budget.
6. Record before/after readiness and retry counts.
7. Independently verify terminal-state decisions.

## Decision points
Transient 5xx/timeouts may retry; confirmed dead process, auth failures, and protocol incompatibility stop.

## Expected output
Typed state/action plus evidence and retry budget.

## Metrics
Recovery rate, p50/p95 time-to-ready, retries/session, false terminal failures.

## Verification
Regression fixtures plus production-like trace replay.

## Failure handling
After budget exhaustion remain failed/degraded and surface the cause; never hide failure with unbounded retries.

## Stop conditions
Configured retry budget exhausted or terminal error identified.
