# Skill: MCP Authorization Audit

## Purpose
Prove that an MCP authorization path binds every accepted credential to the intended protected resource and never reuses the inbound token across an upstream trust boundary.

## Trigger
New MCP server/gateway, OAuth migration, authorization-server change, new upstream API, incident review, or regression test.

## Inputs
Sanitized token-claim metadata; MCP resource URL; expected audience/resource; issuer; allowed scopes; gateway/upstream topology; policy JSON.

## Preconditions
No raw bearer tokens in artifacts. The reviewer can identify the MCP resource and every upstream API.

## Required context
Current MCP authorization security requirements and the deployment's identity topology.

## Allowed tools
Configuration readers, JWT claim decoders that do not transmit tokens, OAuth metadata fetchers, the local guard script, tests.

## Constraints
MUST NOT log credentials. MUST NOT infer authorization from signature validity alone. MUST treat each upstream API as a separate resource boundary.

## Procedure
1. Draw client -> authorization server -> MCP resource -> upstream API boundaries.
2. Record the exact resource identifier requested by the client.
3. Record expected audience/resource accepted by the MCP server.
4. Verify issuer and scope policy.
5. Verify inbound token is never forwarded unchanged upstream.
6. Run `scripts/mcp_oauth_guard.py` on sanitized policy metadata.
7. Run negative fixtures for wrong audience, wrong resource, wrong issuer, excessive scope and passthrough.
8. Require an independent reviewer for production authorization changes.

## Decision points
If the token is not resource-bound, fail. If an upstream token is the same credential as the inbound token, fail. If metadata is ambiguous, fail closed.

## Expected output
A policy fixture, guard result, violations (if any), remediation decision and verification status.

## Metrics
Coverage of MCP resources with explicit expected audience; passthrough violations; excessive scopes; failing negative tests.

## Verification
All positive fixtures pass and all negative fixtures fail with deterministic reasons.

## Failure handling
Maximum two remediation/retest cycles. Then escalate with evidence.

## Stop conditions
Stop immediately if a raw secret appears in logs/artifacts or if the intended resource cannot be identified.