# Redirect Safety Rules

## MUST
- Record every redirect hop with URL, status, and header names; redact header values before evidence is persisted.
- Strip `Authorization`, `Proxy-Authorization`, `Cookie`, `X-API-Key`, and `Api-Key` before following a redirect to a different host.
- Block HTTPS-to-HTTP downgrade redirects.
- Block redirects to loopback, link-local, or private IP destinations unless the exact destination is explicitly approved.
- Cap automatic redirects at the configured `max_redirect_hops`.
- Require independent verification after remediation.

## MUST NOT
- Log credential values, tokens, cookies, signed URLs, or secret query parameters.
- Treat a matching parent domain as proof that credentials may be forwarded to a subdomain.
- Disable TLS verification to make a redirected request succeed.
- Expand redirect allowlists automatically.
- Perform production configuration, secret, proxy, firewall, or DNS changes without explicit human approval.

## SHOULD
- Disable automatic redirect following in privileged HTTP clients and evaluate each Location target explicitly.
- Prefer exact-host allowlists over suffix allowlists.
- Add a regression test for every confirmed leak path.
