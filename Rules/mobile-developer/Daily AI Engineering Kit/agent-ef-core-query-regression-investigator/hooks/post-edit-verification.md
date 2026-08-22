# Hook: Post-Edit Verification

## Trigger
After any source or test edit made by the Query Fix Implementer.

## Preconditions
Target solution/project is known and no approval-required action is pending.

## Action
Execute:

`bash scripts/verify-repository.sh --verify`

Then capture generated SQL for the representative scenario and run the targeted behavioral/performance verification defined in the investigation artifact.

## Expected result
Formatting check, build, and tests selected by the script succeed; generated SQL and performance evidence are refreshed.

## Failure behavior
Failure blocks completion. Preserve command output and return to implementation or investigation; never hide failure by increasing timeouts.

## Blocking
Yes.
