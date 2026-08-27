# Hook: Pre Completion Verification

## Trigger
Immediately before an agent reports task completion.

## Preconditions
Task scope, current repository HEAD, relevant changed paths and verification command are known.

## Action
Run the receipt validator against the latest successful receipt and current state.

## Script/command
`python scripts/verification_receipt.py validate --receipt .verification-receipt.json --head <HEAD> --command "<verification-command>" --paths <path> [<path> ...]`

## Expected result
Exit code 0 with `status: satisfied`.

## Failure behavior
Exit code 3 blocks completion and requires a fresh verification or orchestration escalation according to the bounded workflow.

## Blocking
Yes.
