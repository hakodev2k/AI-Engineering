# Hook: Post Compaction

## Trigger
Immediately after automatic/manual context compaction and before any consequential action.

## Preconditions
A checkpoint JSON has been built from explicit summary claims plus fresh external-state reads.

## Action
Run:
`python scripts/checkpoint_verify.py checkpoint.json`

## Expected result
Exit 0 with `critical_verification_coverage` equal to 1.0.

## Failure behavior
Exit 3 blocks continuation. Re-ground missing or contradicted claims. Maximum 2 repair cycles; never weaken evidence requirements to force a pass.

## Blocks completion
Yes.
