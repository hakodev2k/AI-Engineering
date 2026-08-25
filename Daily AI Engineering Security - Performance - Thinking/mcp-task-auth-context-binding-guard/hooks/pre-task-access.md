# Hook: Pre-Task Access Authorization

## Trigger
Before `tasks/get`, `tasks/cancel`, `tasks/update`, or task result access.

## Preconditions
Host authentication has produced a trusted normalized principal/resource context.

## Action
Load the task ownership binding, recompute the keyed fingerprint for the current context, compare in constant time, and deny on absence/mismatch.

## Script/command
Reference diagnostic: `python scripts/task_binding.py check registry.json --task-id <id> --principal <normalized-context>`.

## Expected result
Exit 0 only for the bound owner under the configured key.

## Failure behavior
Exit 2 denies access. Exit 1 is configuration/input failure and also denies access.

## Blocks completion
Yes for the requested task operation. No fallback to task-ID-only authorization is permitted.