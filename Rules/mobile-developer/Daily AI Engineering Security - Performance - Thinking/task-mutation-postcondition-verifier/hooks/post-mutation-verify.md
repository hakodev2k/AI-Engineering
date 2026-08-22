# Hook — Post Mutation Verify

## Trigger
Immediately after the caller receives a mutation response and before dependent actions.

## Preconditions
`pre.json`, `post.json`, and `expect.json` exist and contain metadata-only snapshots.

## Action
Run deterministic postcondition verification.

## Command
```bash
python scripts/verify_postconditions.py --pre pre.json --post post.json --expect expect.json
```

## Expected result
Exit `0` with `verified-success` only when all required postconditions are observed.

## Failure behavior
Exit `2` means verified failure; exit `4` means indeterminate; exit `3` means malformed input/environment. All nonzero outcomes block dependent destructive actions.

## Completion blocking
Yes.
