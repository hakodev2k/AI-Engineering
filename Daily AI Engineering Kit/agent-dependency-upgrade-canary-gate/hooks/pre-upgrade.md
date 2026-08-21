# Hook: Pre-upgrade Baseline

## Trigger
Immediately before the first dependency edit.

## Preconditions
Repository root is known; required approval has already been obtained; Python 3 is available.

## Action
Run:

`python scripts/capture-baseline.py --root <repo-root>`

## Expected result
Exit code 0 and `.ai/dependency-upgrade-canary/baseline.json` containing HEAD, Git status, manifest/lockfile hashes, and detected package files.

## Failure behavior
Any non-zero exit blocks execution. Do not edit dependency files after a failed baseline. Preserve stderr/stdout for investigation.

## Blocking
Yes.
