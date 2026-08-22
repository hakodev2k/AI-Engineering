# Hook: Post-upgrade Verification

## Trigger
After dependency restore/install and request-specific verification commands complete.

## Preconditions
`baseline.json` exists; upgrade request exists; repository contains the proposed change.

## Action
Run:

`python scripts/verify-upgrade.py --root <repo-root> --request <upgrade-request.yaml>`

## Expected result
Exit code 0 and `.ai/dependency-upgrade-canary/verification.json` showing changed files, baseline comparison, command results, and scope status.

## Failure behavior
Non-zero exit blocks completion and returns evidence to the implementation stage. Retry only after a changed hypothesis or a transient failure, maximum two cycles.

## Blocking
Yes.
