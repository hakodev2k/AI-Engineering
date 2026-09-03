# Hook: Pre-Execution Denial Check

## Trigger
Immediately before any tool performs an execution, write, deployment, or other side-effecting operation after a prior policy denial exists in the task.

## Preconditions
`config/policy.json`, the task denial ledger, and proposed operation JSON are available.

## Action
Run:

```bash
python scripts/denial_gate.py --policy config/policy.json --ledger <ledger.json> --operation <operation.json> [--approval <approval.json>]
```

## Expected result
Exit `0` only for an operation with no matching active denial or a correctly scoped explicit approval. Exit `3` for an equivalent active denial. Exit `2` for malformed or unavailable policy/provenance data.

## Failure behavior
Any non-zero result blocks the proposed side effect. Capture the structured decision in the audit trace. Do not retry through another executor automatically.

## Blocking
Yes. This hook is a security boundary.
