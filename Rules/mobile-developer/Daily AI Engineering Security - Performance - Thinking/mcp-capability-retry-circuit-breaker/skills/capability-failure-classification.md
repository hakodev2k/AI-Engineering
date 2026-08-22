# Skill: Capability Failure Classification

## Purpose
Classify MCP discovery/tool failures into terminal unsupported, transient, configuration, or unknown classes before retry decisions are made.

## Trigger
Run after any MCP method failure or before a scheduled refresh repeats a previously failed method.

## Inputs
Server identity, advertised capabilities, method name, error code/message, transport status, attempt history, timestamps.

## Preconditions
Initialization/capability metadata and the raw protocol error are available where possible.

## Required context
Per-server capability state and retry history only; full conversation context is unnecessary.

## Allowed tools
Protocol metadata inspection, structured logs, deterministic classifier script, timer/backoff scheduler.

## Constraints
Do not infer support merely because a method existed on another server/version. Do not retry deterministic `-32601 Method not found` unless the server identity/version/capability epoch changes.

## Procedure
1. Compare requested method with advertised capabilities.
2. Parse protocol response.
3. Classify `-32601` as `unsupported-terminal` for the current capability epoch.
4. Classify transport timeout/connection reset/5xx-like gateway failure as `transient` unless repeated beyond budget.
5. Classify authentication/config/schema errors separately; do not hide them behind retry.
6. Record classification, attempt count, first/last failure, and next allowed action.
7. Emit a circuit-breaker decision.

## Decision points
- Unsupported terminal: open breaker immediately for that method/server epoch.
- Transient: retry with exponential backoff and jitter, maximum 4 attempts.
- Configuration/authentication: stop automatic retry and surface actionable state.
- Unknown: allow one diagnostic retry, then stop and escalate.

## Expected output
Structured decision: server, method, class, breaker state, next retry time, attempt budget, evidence.

## Metrics
Retries avoided, retry success rate, time-to-quiescence, idle CPU, idle I/O, log events/minute.

## Verification
Replay representative errors and confirm deterministic classification and bounded retry counts.

## Failure handling
If classification input is malformed, return BLOCK/unknown rather than defaulting to infinite retry.

## Stop conditions
Stop after the class-specific retry budget or immediately for terminal/configuration failures.