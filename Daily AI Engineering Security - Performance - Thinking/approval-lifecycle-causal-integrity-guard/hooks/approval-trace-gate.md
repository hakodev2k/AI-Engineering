# Hook — Approval Trace Gate

## Trigger
Before a performance diagnosis, retry decision, or completion claim that depends on an approval-gated tool call.

## Preconditions
A JSONL trace exists for the relevant call IDs.

## Action
Run:

`python scripts/audit_approval_trace.py path/to/trace.jsonl`

## Expected result
Exit 0 with `blocking_violations: 0`.

## Failure behavior
Exit 2 blocks the dependent diagnosis/change. Exit 1 indicates invalid input/tool failure and also blocks completion.

## Blocks completion
Yes. A failed lifecycle audit cannot be bypassed by relabeling wall-clock latency as execution latency.
