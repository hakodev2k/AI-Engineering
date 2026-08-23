# Final Verification Hook

## Trigger
Before reporting task success.

## Preconditions
Implementation tests passed and any required approval was obtained.

## Action
A Verification Agent independently runs `python scripts/run-contract-tests.py` and reviews `python scripts/inspect-changes.py` output.

## Expected result
Tests pass, invalid fixtures fail closed, and no unrelated or dangerous changes exist.

## Failure behavior
Set status to `failed` or `blocked`; never report verified success.

## Blocking
Yes.