# MCP Server Security Rules

1. MCP endpoints with dangerous capabilities **MUST** require authenticated callers.
2. Servers **MUST NOT** bind to wildcard/public interfaces without an explicit network requirement, authentication, and authorization controls.
3. Authentication **MUST** be enforced in the actual request path; assumed upstream authentication **MUST NOT** count if the backend is directly reachable.
4. Dangerous tools **MUST** use least privilege and **SHOULD** require human approval for irreversible or high-impact actions.
5. Listener defaults **MUST** fail closed to loopback or an explicitly configured trusted interface.
6. Configuration and logs **MUST NOT** contain plaintext secrets.
7. Tool authorization **MUST** be evaluated independently from model instructions.
8. Exceptions **MUST** include owner, rationale, scope, and expiry and **MUST NOT** silently downgrade a blocking result.
9. Security verification **MUST** include a negative-auth test for each sensitive endpoint.
10. The implementing agent **MUST NOT** be the sole verifier of a high-risk transport or authorization change.
11. Network/firewall controls **SHOULD** provide defense in depth but **MUST NOT** be treated as a substitute for authentication on sensitive remotely reachable services.
12. A deployment **MUST** remain blocked when effective listener, auth, or capability state is unknown.