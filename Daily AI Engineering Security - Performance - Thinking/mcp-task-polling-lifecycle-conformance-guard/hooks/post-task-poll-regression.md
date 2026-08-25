# Hook: Post-Task Poll Regression Check

## Trigger
After a Tasks lifecycle integration test or benchmark run.

## Preconditions
Canonical JSONL trace has been written and workload class/SLO are known.

## Action
Run the lifecycle auditor before accepting the client change.

## Script/command
`python scripts/task_poll_audit.py <trace.jsonl> --max-polls 100 --max-elapsed-ms 900000 --slack-ms 5`

## Expected result
Exit 0 and zero post-cancel/post-terminal/interval/budget violations.

## Failure behavior
Exit 2 blocks verification; exit 1 indicates invalid evidence and also blocks verification. Route back to `workflows/measure-fix-regress.md` within its two-cycle limit.

## Blocks completion
Yes for a performance/conformance claim.