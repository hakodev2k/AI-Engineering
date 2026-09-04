# Hook: Pre-Resume Prefix Check

## Trigger
Immediately before the first provider/model request after a durable session resume or reconstruction.

## Preconditions
A baseline manifest from the known-good session request and a reconstructed resumed manifest are available.

## Action
Compare runtime identity and exact prefix segments with `scripts/prefix_persistence_guard.py` before the expensive model call.

## Script/command
`python scripts/prefix_persistence_guard.py --baseline baseline.json --resumed resumed.json --config config/policy.json`

## Expected result
Exit code `0` and `decision=allow` for an exact same-runtime match. Exit code `2` for missing/drifted state or a runtime change requiring explicit rebaseline. Exit code `3` for invalid inputs.

## Failure behavior
Do not silently claim cache continuity. Preserve non-secret hashes/lengths and classify the failure. Keep all correctness-critical context. Follow the workflow diagnosis/rebaseline path.

## Blocks completion
Yes for claiming Verified cache persistence. Host policy may choose warning-only execution for availability, but such a run remains unverified and its full cache/token cost must be measured rather than hidden.
