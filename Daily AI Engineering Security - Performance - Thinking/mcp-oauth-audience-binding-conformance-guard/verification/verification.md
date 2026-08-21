# Verification Record

## Scope
This record verifies the reusable package artifacts and defines the evidence required to verify a real MCP deployment. It does not claim that an external deployment has been secured merely because the package exists.

## Implemented
- Canonical resource policy with fail-closed audience rules.
- Deterministic authorization/token/refresh request checks.
- Deterministic decoded-claims checks for issuer, exact audience, expiry, and required scopes.
- Token-passthrough fingerprint comparison that never prints bearer values.
- Positive and negative fixtures.
- Regression tests for valid token, sibling audience, multiple audiences, missing audience, wrong issuer, expiry, missing scope, missing request resource, refresh drift, and passthrough.
- Skills, rules, subagents, bounded workflows, hooks, evidence, and integration guidance.

## Measured
Package-level measurable acceptance criteria are encoded in `tests/test_guard.py` and workflow metrics:
- mandatory valid fixture acceptance target: 100%;
- mandatory wrong-resource rejection target: 100%;
- passthrough target: 0;
- negative fixture coverage target: 100%;
- logical validation retries are bounded by policy.

The package deliberately does not fabricate production measurements. Deployment-specific values must be collected by the integrating team from staging or production-safe conformance runs.

## Verified
A deployment may be marked **Verified** only when an independent verifier records all of the following:
1. production JWT/OAuth middleware performs cryptographic signature/key validation;
2. canonical public MCP resource matches protected-resource metadata;
3. valid resource-bound token succeeds;
4. validly signed sibling-resource token fails;
5. missing/incorrect audience fails;
6. wrong issuer and expired token fail;
7. insufficient authorization is denied;
8. refresh preserves resource binding;
9. an MCP proxy does not pass inbound bearer token to upstream APIs;
10. no secrets appear in logs or stored test evidence.

## Security invariants
- Authentication success is not authorization proof.
- Signature validity is not sufficient without resource/audience validity.
- Client compatibility failures cannot be fixed by broadening server audience acceptance.
- Provider-specific request syntax may vary, but effective token resource restriction cannot be waived.
- Inbound and upstream access tokens are separate security credentials.

## Failure and recovery
**Detection:** non-zero conformance command, negative fixture unexpectedly accepted, metadata mismatch, or equal inbound/outbound token fingerprint.

**Evidence:** sanitized request fields, decoded non-secret claims, policy version, validator output, and token hashes only.

**Retry policy:** one retry for transient capture/infrastructure failure; maximum two implementation/test cycles for a logic/configuration fix.

**Fallback:** restore last known strict configuration or block the integration. Never fall back to wildcard audiences or disabled validation.

**Escalation:** IdP/platform owner and security reviewer when provider behavior prevents demonstrable resource restriction.

**Stop condition:** any wrong-resource token remains accepted or token passthrough cannot be excluded.

## Definition of Done
- Research evidence exists and is source-linked.
- Current solution and limitations are documented.
- Policy identifies one canonical MCP resource.
- Deterministic tooling and fixtures exist.
- Mandatory negative paths are represented in tests.
- Independent verification procedure is documented.
- Security controls are fail-closed.
- No real credential is embedded in package artifacts.
- README references only generated package files.

A real deployment has an additional DoD: all deployment verification criteria above must be executed successfully and retained as evidence.
