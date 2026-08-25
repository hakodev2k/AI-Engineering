# Hook — Pre-Resume Cache Boundary

## Trigger
Immediately before the first model call of a resumed session.

## Preconditions
Checkpoint and current boundary manifests exist and contain no raw secrets.

## Action
Run `python3 scripts/cache_boundary.py checkpoint.json current.json --json`.

## Expected result
Exit 0 means cache-relevant identity is structurally compatible. Exit 3 reports drift and names changed fields. Exit 2 indicates invalid input.

## Failure behavior
Exit 2 MUST block automatic resume until metadata is repaired. Exit 3 SHOULD block silent resume: either preserve compatible configuration or proceed as an explicitly measured cold start according to host policy.

## Blocking
Invalid manifests always block. Structural drift blocks silent/unmeasured resume.