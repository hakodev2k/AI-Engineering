# Hook: Pre-Tool-Execution Integrity Check

## Trigger
Immediately before the executor receives a finalized tool call.

## Preconditions
The stream assembler has produced an integrity envelope, the provider terminal state is known, the current tool schema is available, and authorization has been evaluated.

## Action
1. Persist the finalized envelope used for the decision, with sensitive values redacted only in logs.
2. Run the integrity gate against `config/tool-policy.json`.
3. Require exit 0 with decision `ready` before starting execution.
4. Persist the returned integrity hash beside the execution record.
5. For side effects, ensure the idempotency key is stable for the same logical call.
6. After execution, set outcome and run an equivalent post-execution check before marking the call committed.

## Script/command
`python3 scripts/tool_call_gate.py <envelope.json> --policy config/tool-policy.json`

## Expected result
`ready` for a complete, schema-valid, authorized call; `partial`, `deny`, or `reconcile` otherwise.

## Failure behavior
- `partial` (exit 3): wait for completion or terminate cleanly on stream interruption.
- `reconcile` (exit 4): inspect external state; do not retry a side effect.
- `deny` (exit 5): return a structured tool error to the agent, subject to the bounded repair limit.
- `invalid` (exit 2): block unattended execution because enforcement state is unreliable.

## Blocks completion
Yes. No high-impact tool action may bypass this hook or equivalent in-process enforcement.
