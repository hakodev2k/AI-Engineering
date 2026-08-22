# Hook: Final Verification

## Trigger
After targeted and full-spec retests complete.

## Preconditions
A repair report JSON exists and test output has been captured.

## Action
Run:

`python scripts/validate-repair-report.py <repair-report.json>`

Then inspect the diff for skipped tests, weakened assertions, arbitrary sleeps, unrelated edits, and newly introduced brittle selectors.

## Expected result
Validator exits `0`, both retest fields are `pass`, and the independent verifier accepts the diff.

## Failure behavior
Any validator error or failed retest blocks `verified` status. Preserve the report and command output; return to repair only if fewer than 2 total repair attempts have been used.

## Blocking
Yes. Failure blocks completion.
