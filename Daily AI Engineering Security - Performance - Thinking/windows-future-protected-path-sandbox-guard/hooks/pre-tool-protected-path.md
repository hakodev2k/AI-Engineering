# Pre-Tool Protected Path Hook

## Trigger
Immediately before any filesystem-mutating tool call.

## Preconditions
Trusted policy exists; workspace root is known; requested operation and target path are available before execution.

## Action
Invoke the deterministic guard. For rename/move, check both paths separately.

## Script/command
```bash
python scripts/protected_path_guard.py --policy config/protected-paths.json --workspace "$WORKSPACE" --target "$TARGET" --operation "$OPERATION"
```

## Expected result
Exit 0 and JSON `allow` permits evaluation to continue to the native sandbox. Exit 4 blocks the tool call. Exit 2 indicates invalid input/config and also blocks the mutation.

## Failure behavior
Fail closed. Log path metadata and reason only; never dump file contents or secrets.

## Blocks completion?
Yes for any required protected-path mutation or unresolved policy error. A dangerous action requires explicit policy change by a human outside the agent run, not a hook bypass.
