# Hook — Pre-Dispatch Authorization Gate

## Trigger
Immediately after trusted authentication middleware verifies the access token and before MCP tool dispatch.

## Preconditions
- Token cryptographic verification succeeded.
- Claims are passed through a trusted in-process or authenticated boundary.
- `config/policy.json` is loaded from trusted deployment configuration.

## Action
Build a minimal claims envelope containing verification status, issuer, audience, canonical resource association, scopes, and operation. Execute the deterministic gate. Dispatch only on exit code 0.

## Script / command
```bash
python3 scripts/audience_gate.py verified-claims.json --policy config/policy.json
```

## Expected result
Intended token/resource/scope combinations return `allow`; mismatches return `deny` with non-secret reason codes.

## Failure behavior
Fail closed. Do not retry with broader audiences, alternate issuers, weaker resource matching, or expanded scopes automatically.

## Blocking
Yes. Any invalid envelope or deny decision blocks protected tool execution.
