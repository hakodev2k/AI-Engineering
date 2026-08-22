# Hook — Pre-dispatch Prefix Check

## Trigger
Immediately before sending an agent request after tool/plugin/request-builder changes, and in CI for equivalent-request fixtures.

## Preconditions
Baseline and candidate manifests have secrets redacted and use the same policy.

## Action
Run:

`python scripts/prefix_stability_guard.py baseline.json candidate.json --policy config/policy.json`

## Expected result
Exit `0` and `decision: allow` with no unexpected divergence in configured stable segments.

## Failure behavior
Exit `2` means malformed/incomplete capture. Exit `3` means stable-prefix regression. Both block a performance-success claim; CI SHOULD block release when the changed component claims cache stability.

## Blocking
This hook blocks only the cache-stability verification gate. It MUST NOT automatically remove required context or weaken safety to force a pass.