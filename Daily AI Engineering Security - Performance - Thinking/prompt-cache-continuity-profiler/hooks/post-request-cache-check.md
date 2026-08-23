# Hook — Post-Request Cache Check

## Trigger
After every model response that includes token usage metadata.

## Preconditions
A safe request profile exists with ordered segment hashes and provider usage fields.

## Action
Run `scripts/cache_profile.py` with the current profile and, when available, the previous comparable profile. Evaluate `config/cache-policy.json` thresholds.

## Command
`python scripts/cache_profile.py current-profile.json --previous previous-profile.json --policy config/cache-policy.json --strict`

## Expected result
Exit `0` indicates within policy. Exit `3` indicates a measurable regression requiring diagnosis. Exit `2` indicates invalid profile/config.

## Failure behavior
Preserve the safe profile and metrics. Do not log raw sensitive prompts by default. Invalid input blocks Verified status. A regression routes to `workflows/profile-optimize-verify.md`.

## Blocks completion
Yes when a required verification run is invalid or a threshold regression remains unexplained.
