# Hook: Pre-File-Operation Target Gate

## Trigger
Before a host-side or privileged read/write/replace/rename whose path is influenced by repository or agent activity.

## Preconditions
Approved roots and symlink policy are configured; the requested path is available before the actual operation.

## Action
Run the target guard on the requested path and intended root. For writes, reject unapproved symlink components and outside-root resolution. Record only path metadata, not file contents.

## Command
```bash
python3 scripts/path_target_guard.py --root /approved/workspace --path /approved/workspace/output.txt --operation write
```

Add `--allow-in-root-symlink` only for a documented exception where the fully resolved target must remain within the root.

## Expected result
Exit 0 with `allowed: true`, a resolved path inside the approved root, and no prohibited symlink component.

## Failure behavior
Exit 2 indicates invalid input/runtime error; exit 3 indicates a security BLOCK. The caller must not perform the requested file operation. Dangerous overrides require explicit human approval outside the script.

## Blocking
Yes for privileged/high-risk file operations.