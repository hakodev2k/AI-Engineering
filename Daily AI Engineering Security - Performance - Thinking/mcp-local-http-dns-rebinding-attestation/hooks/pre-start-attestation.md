# Hook: Pre-Start MCP HTTP Attestation

## Trigger
Before marking a local HTTP MCP server deployment/startup as verified, and after any transport, proxy, bind, auth, or tool-surface change.

## Preconditions
- Endpoint is operator-owned and safe to probe.
- Server is started in the intended deployment topology.
- `config/policy.json` is reviewed for that server.
- If authentication is required, `MCP_ATTEST_AUTHORIZATION` is supplied securely through the environment.

## Action
Run the deterministic runtime attestation against the effective endpoint.

## Command
```bash
python3 scripts/attest_mcp_http.py http://127.0.0.1:8000/mcp --policy config/policy.json
```

## Expected result
Exit `0` and JSON containing `"decision": "pass"`; positive control reaches the server and every configured foreign Host/Origin plus unauthenticated probe is rejected.

## Failure behavior
- Exit `5`: block completion/startup verification; preserve evidence and remediate.
- Exit `4`: block automated verification and require manual review of topology/TLS/proxy behavior.
- Exit `2`: block because input/policy is invalid.

## Blocking
Yes. This hook is a security gate and MUST NOT be converted to warning-only for sensitive MCP endpoints.

## Evidence retention
Retain sanitized JSON reports and policy revision. Do not retain Authorization values or sensitive response bodies.
