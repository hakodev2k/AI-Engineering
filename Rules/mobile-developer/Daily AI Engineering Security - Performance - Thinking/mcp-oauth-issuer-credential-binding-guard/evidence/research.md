# Research — MCP OAuth Issuer Credential Binding Guard

## Topic
MCP OAuth Issuer Credential Binding Guard

## Category
Security

## Problem
MCP clients can connect to many servers and authorization servers. If OAuth credentials, authorization codes, or client registrations are not strongly bound to the issuer and protected resource that created them, a mix-up/confused-deputy path can cause credentials to be redeemed or reused against the wrong authorization server or resource.

## Why it matters now
The MCP 2026-07-28 specification added authorization hardening specifically for issuer validation and credential isolation. The accompanying release notes say clients MUST validate `iss` before redeeming authorization codes and bind client credentials to the issuing authorization server. The TypeScript SDK migration guide also notes these protections are opt-in migration steps, creating a practical gap for clients that have not upgraded or enabled them.

## Affected users
MCP client authors, desktop/CLI agent developers, platform teams connecting multiple remote MCP servers, enterprise identity teams, and operators of MCP gateways/proxies.

## Current public evidence
### Observed evidence
1. MCP 2026-07-28 release notes document authorization-server mix-up risk and require RFC 9207 issuer validation plus issuer-bound client credentials: https://blog.modelcontextprotocol.io/posts/2026-07-28/
2. MCP authorization security considerations explicitly describe confused-deputy risk and require resource-specific token handling: https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/security_considerations
3. The MCP TypeScript SDK migration guide states 2026 auth protections such as issuer validation and credential isolation require explicit upgrade steps/opt-ins: https://ts.sdk.modelcontextprotocol.io/v2/migration/support-2026-07-28
4. MCP Apps authorization guidance requires validating token issuer and ensuring tokens were issued specifically for the MCP server/resource: https://apps.extensions.modelcontextprotocol.io/api/documents/authorization.html

## Existing approaches
- Generic OAuth state/PKCE checks.
- Storing one credential set per MCP server URL.
- Trusting discovered authorization metadata without persisting issuer provenance.
- Refreshing/reusing credentials after server migrations.
- SDK-managed authorization with default configuration.

## Remaining limitations
Server URL alone is not a sufficient identity boundary when authorization-server relationships change. Legacy credential stores may lack issuer metadata. Migration paths can preserve old credentials that are valid but no longer valid for the current issuer/resource relationship. SDK support does not protect integrations that bypass or incompletely configure the SDK.

## Root-cause analysis
- Credential records lack explicit `(resource, issuer, client_id)` binding.
- Authorization responses are redeemed without validating RFC 9207 `iss` against the issuer selected at authorization start.
- Resource metadata changes are not compared to cached credential provenance.
- Tokens are accepted based on signature/expiry but not audience/resource constraints.
- Refresh-token reuse survives issuer migration without forced reauthorization.

## Improvement opportunity
Add a deterministic binding gate around authorization start, callback, token redemption, refresh, and protected tool execution. Persist an immutable authorization transaction envelope; require exact issuer/resource agreement; reject or quarantine legacy credentials lacking provenance; invalidate credentials on issuer change; and run negative tests for mix-up scenarios.

## Goal
Prevent cross-issuer/cross-resource credential reuse while retaining standards-compliant MCP OAuth flows.

## Metrics
- 100% authorization transactions record expected issuer and resource.
- 100% callbacks validate returned `iss` when required by the selected flow.
- 0 credentials are reused after issuer mismatch or resource migration.
- 100% protected tool calls use tokens whose audience/resource and issuer match policy.
- All negative mix-up fixtures are blocked.

## Trigger
Authorization discovery, authorization callback, token redemption, refresh, protected tool call, or change in protected-resource metadata.

## Inputs
Protected resource URL, discovered issuer, authorization response parameters, credential record, token claims/metadata, expected audience/resource, protocol version.

## Outputs
Allow/re-authenticate/deny decision, binding evidence, invalidation action, audit record.

## Interpretation
The protocol changes are evidence that implementers encountered enough interoperability/security concern to standardize stronger binding. This does not imply every earlier implementation is exploitable; risk depends on how issuer/resource provenance is handled.

## Proposed solution
A reusable issuer-binding policy, verifier workflow, deterministic Python validator, and regression gate that make OAuth provenance explicit and testable.