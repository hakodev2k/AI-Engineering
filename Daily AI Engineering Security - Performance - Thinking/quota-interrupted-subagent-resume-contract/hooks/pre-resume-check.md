# Hook: Pre-Resume Check

## Trigger
Immediately before any interrupted child agent is resumed.

## Preconditions
Policy and checkpoint JSON are available.

## Action
Run `python scripts/check_resume_contract.py --policy config/resume-policy.json --checkpoint <checkpoint.json>`.

## Expected result
Exit 0 and JSON with `decision: "ALLOW"`.

## Failure behavior
Exit 2 blocks resume. Preserve the checkpoint and report reasons. Do not mutate the checkpoint merely to satisfy validation.

## Blocks completion
Yes for the resume path. A human may choose a separate recovery strategy after reviewing evidence.
