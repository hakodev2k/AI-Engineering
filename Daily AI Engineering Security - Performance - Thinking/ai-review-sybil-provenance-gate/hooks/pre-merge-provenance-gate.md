# Hook: Pre-Merge Provenance Gate

## Trigger
Immediately before merge authorization for protected/high-risk changes.

## Preconditions
PR event JSON contains author controller provenance and review provenance; policy file is available.

## Action
Run:
`python scripts/review_provenance_gate.py --event <pr-event.json> --policy config/policy.json`

## Expected result
Exit `0` only when independent-controller quorum and required human CODEOWNER checks pass. Exit `3` blocks merge. Exit `2` indicates malformed input and also blocks merge.

## Failure behavior
Fail closed, retain non-secret reason codes, and request verified independent review or provenance repair.

## Blocks completion
Yes. Failure blocks merge; it MUST NOT be bypassed automatically.
