# Hook: Post Change

## Trigger
After configuration-affecting edits.

## Preconditions
Candidate manifests were regenerated from changed sources.

## Action
1. Run `scripts/config_parity_gate.py` against all governed manifests.
2. Run relevant host build/tests.
3. Run `python scripts/verify_package.py` when validating this kit itself.
4. Inspect changed files for accidental secret values and unrelated config edits.
5. Preserve report/test evidence for Verification Agent.

## Expected result
Deterministic parity status with host validation evidence.

## Failure behavior
Any parity error, secret exposure, invalid input, failed host validation, or unresolved approval blocks completion.

## Blocking
Yes.
