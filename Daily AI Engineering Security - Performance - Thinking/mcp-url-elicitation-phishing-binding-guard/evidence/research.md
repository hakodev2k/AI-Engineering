# Research — MCP URL Elicitation Phishing Binding Guard

## Topic
MCP URL-mode elicitation phishing, cross-user completion, and unsafe navigation binding.

## Category
Security

## Problem
MCP URL-mode elicitation sends users to an external browser for OAuth, payment, or other sensitive interactions. The boundary is secure only if the client surfaces the real destination and the server binds browser completion to the same authenticated principal and originating interaction. Otherwise a legitimate-looking flow can become a phishing primitive or bind a victim's authorization to another user's agent session.

## Why it matters now
MCP's 2026-07-28 stateless redesign moves modern elicitation into multi-round-trip `inputRequired` flows and changes correlation semantics. Current TypeScript SDK guidance states that modern URL elicitation no longer carries the legacy `elicitationId`; correlation is server-owned across retries. Meanwhile, the protocol explicitly documents a phishing attack where one user forwards an authorization URL to another user.

## Affected users
MCP client/host implementers, MCP server authors implementing third-party OAuth/payments/account-linking, shared-gateway operators, and multi-user agent platforms.

## Current public evidence

### Observed evidence
1. The MCP URL Elicitation specification documents a phishing scenario in which Alice obtains an elicitation URL and tricks Bob into completing it; the server must verify that the user opening/completing the flow is the initiating user. It also requires clients to display the target host and obtain consent before navigation. Source: https://modelcontextprotocol.io/specification/2025-11-25/client/elicitation
2. SEP-1036 requires URL validation, explicit consent, domain display, user identity verification at the start and end of the flow, authenticated-session binding, rate limiting, timeout handling, and audit logging. Source: https://github.com/modelcontextprotocol/modelcontextprotocol/issues/1036
3. The TypeScript SDK's 2026-07-28 migration guidance states that modern URL elicitation is carried in `inputRequired` and no longer uses legacy `elicitationId`/completion notification; correlation is the server's own state across retries. Source: https://github.com/modelcontextprotocol/typescript-sdk/blob/main/docs/migration/support-2026-07-28.md
4. Python SDK issue #2965 reports capability checking that does not distinguish form vs URL elicitation sub-capabilities, showing that capability-level enforcement has had implementation gaps. Source: https://github.com/modelcontextprotocol/python-sdk/issues/2965

### Interpretation
Protocol requirements are necessary but not sufficient as an implementation contract. Consent does not prove identity, a correct HTTPS domain does not prevent replay, and version adapters can preserve UI behavior while losing correlation semantics.

## Existing approaches
MCP destination disclosure and consent requirements; OAuth state/PKCE and authenticated browser sessions; legacy `elicitationId`; modern `inputRequired` state; generic domain allowlists.

## Remaining limitations
Domain display does not prove browser principal identity; allowlists do not prevent replay of valid links; legacy and 2026 correlation models differ; completion may be accepted from weakly bound application state; capability implementations can blur form vs URL mode.

## Root-cause analysis
1. URL mode crosses MCP and browser trust domains.
2. Browser completion is asynchronous and copyable.
3. Application-specific identity binding cannot be enforced by the wire protocol alone.
4. 2026-era MRTR makes correlation application state responsibility.
5. Human consent is sometimes misused as authorization proof.

## Improvement opportunity
Use a deterministic binding envelope over MCP principal, server origin, logical request, target origin, nonce, and expiry. Validate before navigation and completion; reject invalid schemes, embedded credentials, origin drift, expiry, nonce reuse, and principal mismatch.

## Proposed solution
A no-dependency Python validator, enforceable client/server rules, review skill, independent verifier, bounded workflow, and regression fixtures.

## Goal
Block URL-mode phishing and cross-user/cross-request completion while preserving legitimate browser flows.

## Metrics
`unsafe_navigation_blocked_total`, `principal_mismatch_blocked_total`, `origin_drift_blocked_total`, `replay_blocked_total`, `expired_binding_blocked_total`, consent coverage, completion-binding coverage, and legitimate false-positive rate.

## Trigger
Any URL-mode elicitation, URL-required error, or modern `inputRequired.elicitUrl` flow before navigation and again before accepting completion.

## Inputs
MCP principal, server origin, logical request ID, target URL, nonce, timestamps, approval decision, completion principal.

## Outputs
Allow/block decision, normalized target origin, binding digest, reason code, redacted audit record.

## Relevant sources
- https://modelcontextprotocol.io/specification/2025-11-25/client/elicitation
- https://github.com/modelcontextprotocol/modelcontextprotocol/issues/1036
- https://github.com/modelcontextprotocol/typescript-sdk/blob/main/docs/migration/support-2026-07-28.md
- https://github.com/modelcontextprotocol/python-sdk/issues/2965
