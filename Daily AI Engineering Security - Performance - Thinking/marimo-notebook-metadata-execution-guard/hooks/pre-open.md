# Hook: Pre-open Metadata Gate

## Trigger
Before any editor/import/runtime path processes an externally sourced notebook.

## Preconditions
Metadata has been extracted without executing the artifact.

## Action
Run:
`python scripts/metadata_guard.py --metadata <metadata.json> --policy config/policy.json`

## Expected result
Exit code 0 only for data-only allowlisted metadata; exit code 3 for quarantine.

## Failure behavior
Any non-zero result blocks opening in a side-effect-capable runtime and records reason codes.

## Blocking
Yes.
