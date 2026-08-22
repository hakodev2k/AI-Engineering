# Skill: Resource Audience Validation

## Purpose
Verify that a cryptographically validated OAuth access token is authorized for this exact MCP resource before any protected tool runs.

## Trigger
Every protected MCP request after normal JWT/OAuth verification and before tool dispatch.

## Inputs
Verified claims (`iss`, `aud`, optional `resource`, `scope`, `sub`), canonical MCP resource URI, required scopes, downstream credential mode.

## Preconditions
TLS and production token signature/expiry verification are already active. Resource identifier is explicitly configured.

## Required context
MCP server URL, authorization server metadata, tool scope requirements, upstream API credential design.

## Allowed tools
OAuth/JWT library, MCP SDK auth helpers, this package's deterministic script, CI test runner.

## Constraints
Never inspect or log raw bearer tokens. Never treat scope as a substitute for audience. Never pass the inbound token to an upstream API.

## Procedure
1. Canonicalize configured resource: absolute URI, lower-case scheme/host, no fragment.
2. Confirm issuer is in the trusted issuer allowlist.
3. Normalize `aud` to a list and require exact canonical resource membership.
4. If a `resource` claim/value is present, require it to match the same canonical resource.
5. Enforce required scopes using set inclusion.
6. Require `sub` when policy requires user identity.
7. Reject any configuration marked as inbound-token passthrough.
8. Emit allow/deny reason code without token/secret material.

## Decision points
Missing audience => deny. Multiple audiences => allow only if configured resource is explicitly included. Wrong issuer/resource => deny. Missing required scope => deny. Upstream call needed => use separate credential/token exchange.

## Expected output
`allow` or `deny` with stable reason codes suitable for metrics.

## Metrics
Denied wrong-audience count, denied passthrough count, false rejection rate on known-good fixtures.

## Verification
Run positive and negative fixtures; independently inspect middleware order so the guard cannot be bypassed.

## Failure handling
Configuration parse/ambiguity fails closed. No automatic retry for deterministic mismatch.

## Stop conditions
Stop and escalate if canonical resource cannot be uniquely defined or production JWT verification cannot be confirmed.