# Hook — Pre-Execution Approval Check

## Trigger
Immediately before any approval-required tool reaches its side-effecting handler.

## Preconditions
A completed approval record contains tool identity, canonical argument digest, and decision.

## Action
Serialize the actual execution payload as `{tool, arguments}`, recompute its digest, and compare against the approved digest. Reject malformed or absent approval-bearing arguments unless absence is explicitly valid in the tool schema.

## Script/command
`python3 scripts/approval_input_guard.py --approval approval.json --execution execution.json`

## Expected result
Exit `0` with `ALLOW` only for exact canonical equality.

## Failure behavior
Exit `2` for invalid input, `3` for corrupt approval records, or `4` for approval/execution mismatch. Preserve sanitized metadata and require fresh approval.

## Blocks completion
Yes. A failed hook MUST block the side effect and MUST NOT be converted into an allow decision by retry/fallback logic.
