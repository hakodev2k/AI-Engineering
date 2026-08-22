# Hook: Pre-Model Cache Budget

## Trigger
Immediately before constructing or sending a model request after any tool-catalog event.

## Preconditions
Current and previous tool catalogs are available; policy is loaded; secrets are redacted from diagnostic artifacts.

## Action
Run `python scripts/cache_prefix_audit.py current-tools.json --previous previous-tools.json --policy config/policy.json`. Record the canonical fingerprint and mutation classification with request telemetry.

## Script/command
`python scripts/cache_prefix_audit.py current-tools.json --previous previous-tools.json --policy config/policy.json`

## Expected result
Exit 0 when the catalog is stable or a semantic change justifies mutation. Exit 3 when semantically equivalent catalogs produce avoidable byte/order drift. Exit 2 on invalid input.

## Failure behavior
Block optimization verification on exit 2 or 3. Do not block a required production request solely because the diagnostic hook is unavailable; emit a measurable degraded-observability state instead.

## Blocks completion
Yes. A package optimization cannot be marked Verified while deterministic drift remains unexplained.
