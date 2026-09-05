# Fail-Closed MCP Authentication Rules

1. Authentication failure **MUST NOT** produce an identity with equal or greater privileges than the failed credential path.
2. Exposed LiteLLM MCP gateways **MUST** run 1.84.0 or later, or MCP routes **MUST** be blocked by a verified compensating control.
3. OAuth2 passthrough **MUST** be enabled only for explicitly targeted MCP servers configured for OAuth2.
4. Public discovery exceptions **MUST** match canonical request paths, not arbitrary URL substrings.
5. Invalid, random, and malformed bearer tokens **MUST** be included in negative security tests.
6. Anonymous identities **MUST NOT** inherit `allow_all_keys`-equivalent sensitive tool access unless explicitly designed, documented, and independently approved.
7. Reverse-proxy authentication **MUST NOT** be assumed effective when the backend is directly reachable.
8. Tool authorization **MUST** be checked independently from transport authentication.
9. Configuration, fixtures, and logs **MUST NOT** contain real credentials.
10. High-risk auth changes **MUST** be verified by an agent/person other than the implementer.
11. Unknown version, route, or auth state **MUST** block completion.
12. Security failures **MUST NOT** be converted to warnings merely to preserve compatibility.