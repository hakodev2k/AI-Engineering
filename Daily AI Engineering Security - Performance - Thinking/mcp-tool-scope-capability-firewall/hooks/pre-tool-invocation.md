# Hook: Pre MCP Tool Invocation Scope Check

## Trigger
Immediately before dispatching a validated MCP tool call.

## Preconditions
Authentication exists; request target fields are parsed; trusted policy is readable.

## Action
Evaluate normalized tool, operation, and target using `scripts/scope_firewall.py`.

## Command
```bash
python scripts/scope_firewall.py "$REQUEST_JSON" --policy config/policy.json
```

## Expected result
Exit `0`: allow. Exit `4`: exact-target approval required. Exit `5`: deny. Exit `2`: invalid input/config.

## Failure behavior
Any nonzero exit blocks automatic invocation. Approval-required routes to HITL showing the normalized target. Invalid or denied requests are logged with reason but without secrets.

## Blocks completion
Yes for the attempted tool action; workflow may continue with a safe alternative if user intent can still be satisfied without broadening scope.
