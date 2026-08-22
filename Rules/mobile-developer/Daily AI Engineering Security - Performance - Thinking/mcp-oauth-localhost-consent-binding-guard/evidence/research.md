# Research — MCP OAuth Localhost Consent Binding Guard

## Topic
MCP OAuth Localhost Consent Binding Guard

## Category
Security

## Problem
Locally running MCP clients commonly use loopback redirect URIs. With Client ID Metadata Documents, a server can verify the metadata document's domain but cannot prove which local process owns a `localhost` callback. An attacker can reuse a legitimate client's metadata URL, bind a loopback callback, and receive an authorization code after the user approves. MCP proxy deployments also remain exposed to confused-deputy failures if consent is not bound to the exact browser/client authorization transaction.

## Why it matters now
The MCP 2026-07-28 authorization specification explicitly calls out localhost redirect URI impersonation and confused-deputy risks. The corresponding security best-practices document, updated with the 2026-07-28 specification, states that Client ID Metadata Documents do not solve local process impersonation and recommends stronger warnings, exact redirect validation, trust policies, PKCE, state validation, and authorization-server binding. A reviewed 2026 FastMCP vulnerability (CVE-2026-27124 / GHSA-rww4-4w9c-7733) demonstrated a real confused-deputy path caused by missing consent verification in an OAuth proxy callback.

## Affected users
MCP client authors, MCP authorization-server implementers, OAuth proxy authors, desktop/CLI AI-agent users, enterprise agent gateways, and teams exposing third-party provider access through MCP.

## Current public evidence
1. MCP 2026-07-28 authorization security considerations document localhost redirect URI impersonation, mix-up attacks, exact redirect matching, PKCE, state validation, and confused-deputy protections: https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/security-considerations
2. MCP 2026-07-28 security best practices describe the localhost attack where an attacker provides the legitimate client's metadata URL as `client_id`, binds a loopback callback, and receives the code. They also recommend HTTPS, URL validation, SSRF defenses, and authorization-server binding: https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices
3. GitHub Advisory GHSA-rww4-4w9c-7733 / CVE-2026-27124 reports a high-severity FastMCP OAuth proxy confused-deputy vulnerability caused by missing consent verification in the IdP callback; patched in FastMCP 3.2.0: https://github.com/advisories/GHSA-rww4-4w9c-7733
4. SEP-991's design discussion explicitly notes that Client ID Metadata Documents cannot prevent localhost impersonation on their own and discusses stronger attestation options: https://github.com/modelcontextprotocol/modelcontextprotocol/issues/991

## Observed evidence
The current MCP protocol explicitly treats loopback client identity as weaker than domain-backed metadata identity, and a production MCP OAuth implementation has already experienced a related consent-binding failure class. These are independent signals: one normative protocol/security-design source and one reviewed implementation vulnerability.

## Existing approaches
- PKCE protects authorization-code redemption by a client that owns the verifier.
- `state` binds browser responses to an originating client transaction.
- Exact redirect URI validation blocks open redirects and redirect substitution.
- Client ID Metadata Documents provide domain-controlled client metadata.
- User consent pages communicate client identity and requested access.
- Static allowlists or domain trust policies restrict which client IDs are accepted.
- Native-app loopback redirects are retained for compatibility.

## Remaining limitations
PKCE does not prove that the browser is returning to the intended local process when an attacker controls the flow from the start. Client ID Metadata Documents prove domain control, not local process identity. `state` is only useful if it is transaction-bound, single-use, and verified by the correct component. Generic consent pages can show a legitimate metadata identity even when the loopback recipient is malicious. OAuth proxies can still become confused deputies when consent, browser session, client identity, redirect URI, authorization server, PKCE challenge, and resource are not bound into one verifiable transaction.

## Root-cause analysis
- Web identity and local-process identity are different trust domains but can be represented by the same client metadata.
- Authorization transaction state is frequently distributed across browser, proxy, MCP client, and upstream identity provider.
- Consent can be treated as a one-time UI event instead of a cryptographically/logically bound transaction artifact.
- Redirect URI checks may validate syntax or registration without tracking the exact callback expected for the current transaction.
- Implementations sometimes validate PKCE/state/resource independently rather than requiring all bindings to agree.
- Local development exceptions can leak into production configurations.

## Improvement opportunity
Introduce a deterministic authorization-transaction binding record that captures client identity, client metadata hash, exact redirect URI, loopback classification, authorization-server issuer, protected resource, scopes, PKCE challenge method/value hash, nonce/state hash, browser-session identifier hash, consent timestamp, and expiry. The callback is accepted only if all configured bindings match and the transaction is unused and unexpired. Loopback flows receive stronger policy: explicit warning/approval, short expiry, fixed expected host class, and optional attestation requirement. Proxy callbacks must consume the record atomically before forwarding any code.

## Goal
Prevent authorization-code delivery or token issuance when the callback cannot be proven to belong to the same consented MCP authorization transaction.

## Metrics
- 100% authorization callbacks validate a single-use transaction record.
- 100% callbacks validate exact redirect URI, issuer, resource, state, and PKCE binding.
- 100% loopback flows are classified and policy-checked separately from HTTPS callbacks.
- 0 replayed/expired/mismatched fixtures reach code forwarding or token exchange.
- All malicious regression fixtures are rejected while approved benign fixtures pass.

## Trigger
Authorization request creation, consent submission, OAuth callback receipt, or proxy forwarding to a third-party authorization server.

## Inputs
Client ID, metadata URL/content hash, redirect URI, issuer, resource, scopes, PKCE challenge, state, browser-session correlation value, consent decision, expiry policy, optional attestation evidence.

## Outputs
A transaction-binding record plus `allow`, `deny`, or `approval_required` decision with machine-readable reasons and audit evidence.

## Interpretation
The evidence does not imply that all loopback MCP OAuth flows are compromised. It shows a protocol-recognized identity gap and a demonstrated confused-deputy class that justify deterministic transaction binding and stronger loopback policy.

## Proposed solution
A reusable package that creates and validates one-time authorization binding records, enforces loopback-specific policy, separates implementation and independent verification roles, and ships deterministic regression tests for replay, redirect substitution, issuer/resource mix-up, stale state, and missing consent.