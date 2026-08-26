# Hook: Pre Tool Registration

## Trigger
Before a tool manifest becomes callable or after approval/sandbox policy changes.

## Preconditions
Effective manifest and central policy are available as JSON.

## Action
Run:

`python scripts/tool_approval_gate.py --manifest <tool-manifest.json> --policy config/policy.json`

## Expected result
Exit 0 permits registration. Exit 3 reports policy violations. Exit 2 reports malformed evidence.

## Failure behavior
Any non-zero result blocks the affected tool set; preserve reason codes without secrets.

## Blocking
Yes.
