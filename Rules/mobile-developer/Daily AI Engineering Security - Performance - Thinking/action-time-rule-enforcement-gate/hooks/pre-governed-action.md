# Hook — Pre Governed Action

## Trigger
Immediately before any action potentially matched by a hard procedural gate.

## Preconditions
Machine-readable action metadata, registry, and current evidence records are available.

## Action
Run:

`python3 scripts/check_action_gates.py --registry <gates.json> --action <action.json> --evidence <evidence.json>`

## Expected result
Exit `0` only when every matched gate has fresh required evidence and no review-only condition applies.

## Failure behavior
Exit `2` blocks due to missing/stale evidence. Exit `3` requests review. Parse/config errors fail closed as review/block according to integration policy; they MUST NOT silently allow.

## Blocking
Yes for matched hard gates. Unmatched actions are allowed by this package, subject to the host's normal security/approval rules.
