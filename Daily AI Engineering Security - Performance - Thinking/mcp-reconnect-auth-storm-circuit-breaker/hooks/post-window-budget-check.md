# Hook: Post-Window Reconnect Budget Check

## Trigger
At the end of a connection-observation window or before another reconnect/auth/discovery attempt after recent churn.

## Preconditions
A JSON array of timestamped MCP maintenance events exists and `config/policy.json` is trusted configuration.

## Action
Run:
`python scripts/reconnect_budget_guard.py --events <events.json> --policy config/policy.json`

## Expected result
Exit `0` when the current window remains within reconnect/OAuth/tool-list/schema-reinjection budgets.

## Failure behavior
Exit `3` activates cooldown/single-flight suppression and surfaces measured violations. Exit `2` blocks automatic retry because input/configuration is invalid.

## Blocking
Yes for automatic reconnect/auth/discovery attempts. A human may explicitly override only after reviewing endpoint health and security impact; the override MUST NOT disable authentication or validation.
