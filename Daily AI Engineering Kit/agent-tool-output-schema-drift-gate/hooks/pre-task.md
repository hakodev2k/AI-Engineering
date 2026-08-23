# Pre-task Hook

## Trigger
Before schema-drift investigation or adapter editing.

## Preconditions
Run from repository root with Python 3.9+.

## Action
Run `python scripts/preflight.py`.

## Expected result
Repository is readable, required package files exist, schemas parse, and fixture directory is valid.

## Failure behavior
Stop and preserve stderr. Do not edit until preflight succeeds.

## Blocking
Yes.