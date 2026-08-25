# Hook — MCP OAuth Reconnect Preflight

## Trigger
Before scheduling another reconnect for an OAuth-backed MCP server.

## Preconditions
Host has server-scoped failure counters, provider generation, and redacted error classification.

## Action
Append a redacted event to the recovery trace and evaluate the bounded provider-aware state machine. Execute only the returned host action: retry transport, recreate provider, open circuit, or mark healthy.

## Script/command
`python scripts/oauth_recovery_guard.py <trace.jsonl> --policy config/recovery_policy.json --output <report.json>`

## Expected result
Reconnect behavior is bounded and provider recreation is explicit/observable.

## Failure behavior
Invalid trace/policy blocks automatic retry scheduling. Circuit-open result stops autonomous retries and escalates.

## Blocks completion
Yes when the integration is still unhealthy or circuit is open.
