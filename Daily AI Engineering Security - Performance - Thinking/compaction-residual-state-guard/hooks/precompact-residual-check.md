# Hook: Pre-Compaction Residual Check

## Trigger
Immediately before history compaction or deletion of oversized model-visible tool output.

## Preconditions
A candidate `manifest.json` describes state that will be retained, omitted, or referenced; policy exists.

## Action
Validate required fields and reject required state that is omitted without a secure recoverable reference and integrity hash.

## Command
`python3 scripts/residual_guard.py manifest.json --policy config/residual-policy.json --strict`

## Expected result
Exit `0` with `decision=allow` and zero blocking required-state findings.

## Failure behavior
Exit `3` blocks compaction. Exit `2` blocks invalid input/config. Repair the manifest/reference or preserve the state inline; do not weaken correctness or security requirements.

## Blocks completion
Yes for the compaction operation. Post-compaction verification remains required before declaring optimization verified.
