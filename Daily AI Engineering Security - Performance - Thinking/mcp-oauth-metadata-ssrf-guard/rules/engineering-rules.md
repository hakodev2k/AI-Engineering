# Engineering Rules

## MUST
- Every metadata-derived network URL MUST pass the same centralized policy boundary before use.
- Every redirect target MUST be revalidated; automatic redirect following MUST be disabled unless the client can enforce equivalent per-hop policy.
- Production OAuth metadata and authorization URLs MUST use HTTPS unless an explicit development-only loopback exception is enabled.
- DNS-resolved destinations MUST be checked against non-global/private/loopback/link-local/reserved ranges before connection.
- A hostname resolving to both allowed and disallowed addresses MUST be denied by default.
- IP literals MUST receive the same address classification as DNS results.
- Browser navigation URLs MUST use a dedicated scheme allowlist.
- Embedded URL credentials MUST be rejected.
- Network timeouts, redirect count and response-size limits MUST be bounded.
- Policy/DNS/parse failures MUST fail closed.
- Security logs MUST emit reason codes without bearer tokens, authorization codes, client secrets or full sensitive query strings.
- A connected peer address MUST be revalidated when the HTTP runtime exposes it; otherwise deployment documentation MUST state that residual DNS rebinding risk remains and recommend egress enforcement/connection pinning.
- Human approval MUST be required before adding a persistent exception for a non-global destination in production.

## MUST NOT
- MUST NOT treat an MCP server's metadata as trusted configuration merely because the initial MCP URL was user-approved.
- MUST NOT permit `file:`, `javascript:`, `data:` or arbitrary custom schemes for OAuth browser navigation.
- MUST NOT validate only the hostname string while ignoring resolved addresses.
- MUST NOT validate only the first URL in a redirect chain.
- MUST NOT weaken SSRF controls to restore OAuth interoperability without recording the exact exception and scope.
- MUST NOT probe cloud metadata endpoints or internal services during routine security tests.
- MUST NOT forward Authorization headers across origin changes by generic redirect behavior.
- MUST NOT retry deterministic policy denials.

## SHOULD
- SHOULD place outbound OAuth discovery behind an egress proxy/firewall as defense in depth.
- SHOULD pin or verify the actual connection peer against approved resolution results when supported.
- SHOULD cache only positive DNS/policy decisions for a short bounded TTL and revalidate after redirects.
- SHOULD maintain separate allowlists for production and local development.
- SHOULD include IPv4, IPv6, IDN, mixed-address, redirect and DNS-failure cases in CI.
- SHOULD expose metrics for blocked URL count, deny reason, discovery latency and policy exceptions.
- SHOULD review policy exceptions regularly and remove unused entries.
