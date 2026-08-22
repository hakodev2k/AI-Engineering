# Hook: Pre-Callback Binding Check

## Trigger
Immediately before an MCP OAuth callback forwards an authorization code or starts token exchange.

## Preconditions
A transaction-binding record exists, policy is loaded, and callback data is available. Raw secrets are kept in memory only.

## Action
Run the deterministic binding validator against the callback and stored record.

## Script/command
```bash
python3 scripts/consent_binding_guard.py verify callback.json --policy config/policy.json --record transaction.json
```

## Expected result
Exit `0` with `decision=allow`; the returned record is marked used and must be persisted atomically before forwarding/exchange.

## Failure behavior
- Exit `2`: malformed input/config; block callback and alert integration owner.
- Exit `4`: reserved for approval-required create flows; block callback.
- Exit `5`: binding mismatch/replay/expiry; block callback, invalidate transaction, log sanitized reason classes.
- Never log authorization codes, state values, PKCE verifiers, tokens, or cookies.

## Blocking
Yes. Any non-zero exit blocks completion and code forwarding/token exchange.