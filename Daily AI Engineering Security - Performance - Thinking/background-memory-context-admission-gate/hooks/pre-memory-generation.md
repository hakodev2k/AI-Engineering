# Hook: Pre-Memory Generation

## Trigger
Immediately before a background memory request is dispatched.

## Preconditions
Readable source and policy; target context configuration available.

## Action
Run `python scripts/memory_admission.py --input "$ROLLOUT" --policy "$POLICY"`.

## Expected result
Exit 0 with `decision=admit`, or exit 2 with `decision=rechunk` and bounded chunk ranges.

## Failure behavior
Exit 2 blocks unchanged dispatch and routes to rechunk strategy. Exit 3 blocks because input/configuration is invalid.

## Blocking
Yes for the original oversized request. Rechunking is an allowed recovery path.
