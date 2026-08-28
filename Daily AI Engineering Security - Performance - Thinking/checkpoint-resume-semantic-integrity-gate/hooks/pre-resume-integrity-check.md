# Hook: Pre-Resume Integrity Check

## Trigger
Before a restored workflow is allowed to perform external writes, approvals, deployments, payments, credential operations or other consequential actions.

## Preconditions
Checkpoint chain is exported and includes the intended restored checkpoint plus first post-resume checkpoint.

## Action
Run:
`python scripts/checkpoint_integrity.py checkpoints.jsonl --expected-signature <signature> --expected-executors <id1> <id2> --json-out resume-integrity.json`
Then run:
`python -m unittest tests/test_checkpoint_integrity.py`

## Expected result
Exit code 0, no integrity violations, tests pass, and independent verification is recorded for high-risk workflows.

## Failure behavior
Exit 2 means invalid/missing evidence. Exit 3 means semantic-integrity violation. Both keep consequential actions blocked.

## Blocking
Yes. Human review may choose a new safe session or repair plan, but MUST NOT waive an ambiguous approval/request state merely to continue execution.
