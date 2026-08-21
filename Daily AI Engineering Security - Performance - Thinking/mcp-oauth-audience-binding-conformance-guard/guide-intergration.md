# Integration Guide

## Purpose
Integrate this package around an existing remote MCP OAuth flow without replacing the OAuth/JWT implementation itself. The guard validates resource/audience invariants and negative cases; production middleware remains responsible for cryptographic signature verification, key rotation, nonce/state/PKCE handling, and transport security.

## 1. Define the canonical resource
Copy `config/policy.json` into your service-specific configuration and replace:
- `canonical_resource` with the externally visible HTTPS MCP resource URL;
- `trusted_issuers` with exact issuer URLs;
- `required_scopes` with minimum MCP authorization scopes.

Do not use an internal Kubernetes/IIS/container hostname if clients address a public gateway URL. Confirm the same identity in RFC 9728 protected-resource metadata.

Run:

```bash
python scripts/mcp_oauth_guard.py check-policy --policy config/policy.json
```

A failure is blocking because later checks depend on stable resource identity.

## 2. Client-side request construction
For providers implementing RFC 8707 resource indicators, capture the sanitized parameters sent at each stage:

```json
{
  "response_type": "code",
  "resource": "https://mcp.example.com/mcp"
}
```

Validate them:

```bash
python scripts/mcp_oauth_guard.py check-request --policy config/policy.json --stage authorize --input request.json
python scripts/mcp_oauth_guard.py check-request --policy config/policy.json --stage token --input token-request.json
python scripts/mcp_oauth_guard.py check-request --policy config/policy.json --stage refresh --input refresh-request.json
```

If the IdP is scope-centric and cannot accept RFC 8707 syntax, create an explicit provider adapter in your application. Do **not** disable server audience checks. The adapter is acceptable only when the issued token's effective audience is still restricted to the canonical MCP resource.

## 3. Resource-server validation
Configure your OAuth/JWT middleware to perform cryptographic validation first, then enforce at minimum:
- exact trusted issuer;
- exact MCP audience/resource;
- expiration/not-before rules;
- required scope or application role;
- appropriate 401 versus 403 behavior.

The included claims guard is for deterministic conformance tests only:

```bash
python scripts/mcp_oauth_guard.py check-token \
  --policy config/policy.json \
  --claims fixtures/token-valid.json \
  --now 1900000000
```

Then prove the negative case fails:

```bash
python scripts/mcp_oauth_guard.py check-token \
  --policy config/policy.json \
  --claims fixtures/token-wrong-audience.json \
  --now 1900000000
```

## 4. Proxy/gateway integration
If the MCP server invokes an upstream API, acquire a **separate** token for that upstream resource. Never reuse the inbound MCP bearer token.

For test traces, keep tokens in environment variables and compare hashes without logging the values:

```bash
export TEST_INBOUND_TOKEN='synthetic-mcp-token'
export TEST_OUTBOUND_TOKEN='synthetic-upstream-token'
python scripts/mcp_oauth_guard.py compare-tokens \
  --policy config/policy.json \
  --inbound-env TEST_INBOUND_TOKEN \
  --outbound-env TEST_OUTBOUND_TOKEN
```

Equal fingerprints fail when passthrough is forbidden.

## 5. CI gate
Run:

```bash
python tests/test_guard.py
```

Gate merge/deploy on success for changes touching:
- OAuth/JWT middleware;
- MCP route or public hostname;
- reverse proxy forwarding;
- authorization-server configuration;
- scopes/roles;
- client OAuth/DCR code;
- refresh-token handling;
- upstream API authentication.

## 6. Provider adapter checklist
A provider adapter may translate the mechanism used to request a resource-bound token, but it may not weaken the invariant. Record:
1. how the target resource is expressed (`resource`, audience parameter, resource-specific scope, or provider-native equivalent);
2. how the resulting token identifies its intended resource;
3. how the MCP server validates that identity;
4. how refresh preserves it;
5. negative evidence showing a sibling-resource token is rejected.

## 7. Production test strategy
Use a staging authorization server or dedicated test clients. Do not commit access tokens, refresh tokens, authorization codes, client secrets, signing keys, or cookies. Store only sanitized request parameters, decoded non-sensitive claim names/values needed for verification, and token fingerprints.

## Failure handling
- Missing/ambiguous canonical resource: stop integration.
- OAuth consent succeeds but token audience is wrong: fix client/AS binding; do not relax server validation.
- Valid sibling token accepted: severity is blocking; restore strict audience validation before rollout.
- Refresh changes resource: revoke/replace flow and investigate provider configuration.
- Inbound/outbound token fingerprints equal: block proxy call and obtain a separate upstream token.
- Repeated provider incompatibility after two implementation cycles: escalate for provider-specific security review rather than adding wildcard audiences.

## Rollout
Start in report-only mode only for observing existing failures, but do not describe a deployment as verified until the enforcement path rejects wrong-resource tokens. Move to blocking CI before production rollout. For an already-running system that currently accepts broad audiences, tighten in staging first and inventory legitimate callers so operational migration does not become an excuse to preserve unsafe audience acceptance.
