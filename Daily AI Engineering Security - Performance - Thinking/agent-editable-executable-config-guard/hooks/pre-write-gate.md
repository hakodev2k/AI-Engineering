# Hook — Pre-Write Executable Configuration Gate

## Trigger
Immediately before an agent-originated create/update/rename of a candidate configuration file.

## Preconditions
The host has the complete proposed bytes in a temporary file that is outside execution paths and will not be sourced.

## Action
Run the deterministic classifier before performing the actual write.

## Script/command
`python scripts/config_guard.py <repo-relative-target> <proposed-content-file> [--approved-sha256 <digest>]`

## Expected result
Exit 0 with `decision=ALLOW` for ordinary files or exact content-bound approved privileged configuration. Exit 10 with `decision=BLOCK` for unapproved privileged configuration. Exit 2 for input/read errors.

## Failure behavior
Exit 10 or 2 blocks the write. Record path, digest, indicators and reason; never record secret file contents. Unsupported/ambiguous formats are escalated to human review.

## Blocks completion
Yes. A blocked privileged write cannot be relabeled successful, and a new execution-capable configuration cannot be consumed until the independent verifier passes.
