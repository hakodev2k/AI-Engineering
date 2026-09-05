# Hook: Post Change

## Trigger
After deadlock-related implementation edits.

## Action
1. Run relevant build/tests.
2. Execute the reproduction harness for at least the configured candidate run count.
3. Preserve all candidate runs, including failures.
4. Run `scripts/deadlock_gate.py`.
5. Run `python scripts/verify_package.py`.
6. Send diff and evidence to Verification Agent.

## Expected result
Candidate has zero wait-for cycles across the bounded run set.

## Failure behavior
Any detected cycle, insufficient run count, invalid capture, or host test failure blocks completion.

## Blocking
Yes.
