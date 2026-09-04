# Hook: Pre-Tool Permission Transition Check

## Trigger
Immediately after a child resume/follow-up/retarget transition is materialized and before its first tool call.

## Preconditions
Expected and effective policy snapshots exist as JSON and contain the configured required fields.

## Action
Run the deterministic comparison gate and refuse tool execution unless it returns an allow verdict.

## Script/command
`python scripts/permission_rebinding_guard.py --expected expected.json --effective effective.json --config config/policy.json`

## Expected result
Exit code `0` with `decision=allow` only for a policy match. Exit code `2` indicates drift/block. Exit code `3` indicates invalid/missing inputs and also blocks.

## Failure behavior
Fail closed. Preserve the checker output and transition identifiers. Do not automatically modify the runtime policy to make the check pass.

## Blocks completion
Yes. A child turn with an unverified permission transition cannot be reported as safely completed.
