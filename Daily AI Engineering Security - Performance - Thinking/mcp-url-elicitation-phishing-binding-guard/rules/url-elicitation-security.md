# URL Elicitation Security Rules

1. Clients **MUST** reject URL-mode elicitation whose scheme is not `https`, except an explicitly configured development-only localhost exception.
2. Clients **MUST** reject URLs containing userinfo credentials.
3. Clients **MUST** display the normalized target origin and obtain explicit user consent before navigation.
4. Clients **MUST NOT** treat consent as proof of completion or identity.
5. Servers **MUST** bind each pending elicitation to the initiating MCP principal, server origin, logical request ID, target origin, unpredictable nonce, and expiry.
6. Servers **MUST NOT** accept completion when any bound field differs.
7. Servers **MUST** consume a successful nonce exactly once; replay **MUST** fail.
8. Servers **MUST** expire pending bindings and **MUST NOT** silently extend expiry after failure.
9. Legacy/2026 adapters **MUST** preserve principal/request/origin binding even when wire correlation changes.
10. URL capability **MUST** be checked independently from form capability.
11. Redirect origin changes **MUST** require policy revalidation; consent **MUST NOT** silently transfer across origins.
12. Sensitive browser input **MUST NOT** enter model context, transcripts, or tool arguments.
13. Logs **SHOULD** record reason codes and binding digests, not secrets or auth codes.
14. Overrides **MUST NOT** disable principal, nonce, replay, expiry, or TLS checks.
