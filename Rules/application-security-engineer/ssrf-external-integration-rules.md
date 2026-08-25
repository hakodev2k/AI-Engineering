# SSRF and External Integration Rules

## Purpose
Prevent server-side request forgery, trust confusion, credential leakage, and cascading failure through outbound integrations.

## Scope
Applies to URL fetchers, webhooks, callbacks, importers, proxy features, cloud SDKs, third-party APIs, and server-initiated network requests influenced by users.

## MUST
- User-influenced destinations MUST be constrained according to the business need using allowlists, validated identifiers, controlled resolvers/proxies, or equivalent controls.
- Outbound requests MUST define timeouts, response-size limits, redirect behavior, and retry policy appropriate to availability and abuse risk.
- Applications MUST protect internal, loopback, link-local, metadata, and administrative endpoints from untrusted request targeting when reachable.
- Credentials sent to external services MUST be scoped to the intended origin/service and MUST NOT be forwarded across attacker-controlled redirects.
- Third-party responses MUST be treated as untrusted input and validated before privileged use.

## MUST NOT
- MUST NOT rely only on string-prefix URL checks for SSRF protection.
- MUST NOT automatically follow arbitrary redirects when destination restrictions are security-relevant.
- MUST NOT include secrets in callback URLs or query strings when safer authenticated mechanisms exist.

## SHOULD
- SHOULD centralize hardened outbound HTTP behavior for sensitive integrations.
- SHOULD isolate high-risk fetchers with network egress restrictions.

## Exceptions
Exceptions require explicit destination model, network exposure analysis, compensating controls, and security approval.

## Verification
Test alternate IP encodings, DNS changes, redirects, private/link-local targets, credential forwarding, timeouts, oversized responses, and malformed third-party data.