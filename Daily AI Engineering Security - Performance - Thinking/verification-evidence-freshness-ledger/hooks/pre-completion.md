# Hook: Pre Completion
## Trigger
Before emitting a completion/verified/ready-to-merge status.
## Preconditions
Current revision and verification ledger are available.
## Action
Run: `python scripts/verification_ledger.py --records <ledger.jsonl> --revision <current-revision> --max-age-seconds <policy-window>`
## Expected result
Exit `0` with `allow_completion` and an evidence key.
## Failure behavior
Exit `3` blocks completion and returns a reason. Exit `2` blocks completion because evidence is malformed.
## Blocking
Yes.
## Duplicate suppression
If the same revision and evidence key already passed the gate, orchestration SHOULD reuse the result rather than request another identical verification run.
