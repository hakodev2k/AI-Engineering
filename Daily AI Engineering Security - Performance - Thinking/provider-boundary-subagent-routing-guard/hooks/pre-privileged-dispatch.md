# Hook: Pre-Privileged Dispatch

## Trigger
Immediately before Guardian, memory, or privileged subagent request dispatch.

## Preconditions
Validated route and sanitized request metadata files exist.

## Action
Run `python3 scripts/route_guard.py route.json request-metadata.json`.

## Expected result
Exit 0 with provider/model equality, only allowed extensions, and verified capability status.

## Failure behavior
Exit 2 blocks for malformed evidence. Exit 3 blocks for a boundary violation. One route-metadata refresh may be attempted; known incompatibility is not retried.

## Blocking
Yes. Failure blocks network dispatch. Approval failures must never become automatic allow; memory failures must defer rather than silently change provider/model.