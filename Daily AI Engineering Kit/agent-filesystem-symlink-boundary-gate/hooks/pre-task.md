# Hook: Pre Task

## Trigger
Before planning filesystem mutations.

## Preconditions
Trusted root is known.

## Action
Run `python scripts/path_boundary_gate.py --root <root> --scan-all --output <pre-task-report>` and record root identity plus current repository status.

## Expected result
Workspace topology is known and no unreviewed external/broken link blocks task paths.

## Failure behavior
Exit 1/2 blocks automated edits. Metadata errors may retry twice.

## Blocking
Yes.