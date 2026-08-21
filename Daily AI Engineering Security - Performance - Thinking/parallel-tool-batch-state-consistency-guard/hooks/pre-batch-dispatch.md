# Hook: Pre-Batch Dispatch Gate

## Trigger
Immediately before dispatching a model-issued batch containing two or more tool calls.

## Preconditions
The orchestrator can assign stable IDs and knows whether tools are side-effecting, approval-gated, handoff-producing, or state-mutating.

## Action
1. Assign one `batch_id` and preserve every model-provided `tool_call_id`.
2. Snapshot `session_id` and `session_version`.
3. Ensure side-effecting tools have an idempotency strategy before any automatic retry is enabled.
4. Mark incompatible stateful pairs that require a commit barrier or selective serialization.
5. Emit a `batch_created` event before starts are scheduled.

## Script / command
After a test run, validate emitted JSONL with:

`python3 scripts/batch_trace_analyzer.py trace.jsonl`

## Expected result
The trace contains a batch creation event, unique tool call IDs, and later exactly one terminal event per issued call.

## Failure behavior
Missing IDs or unknown idempotency for a retryable side-effecting tool blocks parallel dispatch. Fall back only to the minimum safe serialization scope; do not silently fabricate tool results.

## Blocks completion
Yes, when identity or retry safety cannot be established.