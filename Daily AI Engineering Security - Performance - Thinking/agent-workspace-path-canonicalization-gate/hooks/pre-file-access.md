# Hook: Pre File Access

## Trigger
Immediately before any agent-driven read, write, edit, create, attachment expansion, or patch applies to a filesystem target.

## Preconditions
Workspace root, target path and operation are known.

## Action
Invoke:
`python scripts/path_gate.py --policy config/policy.json --workspace <workspace> --target <target> --operation <operation>`

## Expected result
Exit 0 with `decision=allow` only when the resolved path is inside the approved workspace and not denied.

## Failure behavior
Any non-zero exit blocks the filesystem operation and records only the resolved path plus reason code.

## Blocking
Yes. A path-resolution error or outside-workspace result MUST block completion.
