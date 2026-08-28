# Hook: Pre Sandbox Start

## Trigger
Before enabling a workspace-write sandbox or permission profile for an agent task.

## Preconditions
Workspace root exists; `config/policy.json` reflects the selected backend's proven capabilities.

## Action
Run:

`python scripts/protected_path_guard.py --workspace <workspace> --policy config/policy.json`

## Expected result
Exit `0` and JSON decision `allow` only when every configured protected descendant is either outside writable scope, already protected, or covered by a backend capability that denies future-path creation without materialization.

## Failure behavior
Exit `3` blocks sandbox start for that policy. Exit `2` blocks on configuration/input error. Preserve reason codes for review.

## Blocking
Yes. Do not downgrade the check to a warning for autonomous write-capable workloads.
