# Hook: Pre-Agent Review

## Trigger
Before externally writable review content is added to agent context or used to justify a privileged action.

## Preconditions
Raw content and policy are available; requested privileged action and visible evidence are supplied when applicable.

## Action
Run:
`python scripts/review_visibility_guard.py --input <review.txt> --policy config/policy.json [--requested-action <action>] [--visible-evidence <text>]`

## Script/command
The hook performs deterministic inspection only; it does not execute content or requested tools.

## Expected result
Exit 0 permits data-only review. Exit 3 quarantines hidden content or blocks privileged execution. Exit 2 indicates invalid input.

## Failure behavior
Any non-zero result blocks privileged execution, records non-secret reason codes, and preserves the raw input for safe manual inspection.

## Blocking
Yes.
