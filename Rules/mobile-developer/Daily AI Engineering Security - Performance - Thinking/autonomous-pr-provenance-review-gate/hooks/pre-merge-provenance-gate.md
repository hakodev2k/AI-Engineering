# Hook — Pre-Merge Provenance Gate

## Trigger
Immediately before an automated or human merge decision is finalized.

## Preconditions
A JSON evidence snapshot exists for the current PR head SHA and reflects the latest review/check state.

## Action
Run:

`python3 scripts/provenance_gate.py evidence.json --policy config/policy.json --strict`

## Expected result
Exit code `0` with decision `allow`.

## Failure behavior
- Exit `2`: evidence/config invalid — block.
- Exit `3`: additional independent review required — block automated merge and route to verifier.
- Exit `4`: explicit policy failure — block merge.

## Blocking
Yes. The hook blocks completion unless the deterministic decision is `allow` and any sensitive-change independent verification has completed.