# Skill: Validate Streamed Tool Transaction

## Purpose
Ensure a streamed tool call is complete, parseable, schema-valid, and execution-safe before any side effect begins.

## Trigger
A provider emits tool-call fragments or a stream ends while a tool call is being assembled.

## Inputs
Call ID, tool name, raw fragments, terminal-event flag, tool schema, execution state, retry count.

## Preconditions
Raw stream fragments are preserved unchanged and the target tool schema is available.

## Required context
Current tool transaction, prior retry record for the same logical operation, and required acceptance criteria. Unrelated conversation history is not needed.

## Allowed tools
JSON parser, schema validator, hashing, immutable audit log, retry controller, read-only state inspection.

## Constraints
- MUST NOT execute from partial JSON.
- MUST NOT replace malformed arguments with `{}` unless the declared tool schema explicitly permits an empty object and the stream is complete.
- MUST preserve raw evidence separately from any normalized representation.
- MUST distinguish `not-started`, `started`, `succeeded`, `failed`, and `unknown` execution state.
- MUST NOT retry a write when execution state is `unknown` without idempotency evidence or human resolution.

## Procedure
1. Collect fragments without mutating the raw buffer.
2. Require the configured terminal/complete condition.
3. Parse the complete raw argument string.
4. Validate arguments against the declared schema.
5. Compute a transaction hash from call identity, tool, and raw arguments.
6. Confirm no conflicting transaction with the same call ID exists.
7. If valid and `not-started`, emit `ready`.
8. If incomplete/malformed and definitely `not-started`, emit `retry` while under retry budget.
9. If execution state is `unknown`, emit `reconcile`; do not replay automatically.
10. Record a model-visible fact when recovery fails, so downstream planning cannot assume success.

## Decision points
- Complete + valid + not-started → ready.
- Incomplete/malformed + not-started + retries remaining → retry.
- Duplicate identity with different arguments → block.
- Started/unknown write → reconcile before any replay.
- Retry budget exhausted → block and surface failure.

## Expected output
Transaction decision, immutable evidence hash, parsed arguments only when valid, execution state, reason, and retry count.

## Metrics
Malformed-call execution count, silent-repair count, recovery success rate, retries/call, unknown-state count, false completion claims.

## Verification
Run the adversarial fixtures in `tests/fixtures.json`; no incomplete or conflicting transaction may return `ready`.

## Failure handling
Preserve evidence, provide explicit failure status to the orchestrator/model, and block completion when the failed tool is required by acceptance criteria.

## Stop conditions
At most 2 automatic retries by default. Unknown execution state stops automatic recovery immediately.