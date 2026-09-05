# Auth Fail-Closed Rules

1. Every security-critical AI/agent endpoint **MUST** require authenticated identity before executing or revealing privileged functionality.
2. Authentication initialization or verification errors **MUST** deny access; they **MUST NOT** silently fall back to anonymous mode.
3. A backend that relies on upstream authentication **MUST NOT** be directly reachable from an untrusted network path.
4. Critical endpoints **MUST NOT** be covered by prefix-based anonymous/whitelist route matching.
5. Route exemptions **MUST** use the narrowest exact-match semantics practicable and **MUST** be reviewed when routes change.
6. Network placement, obscurity, or an unguessable URL **MUST NOT** substitute for authentication.
7. Critical endpoint inventories **MUST** include agent execution, tool execution, credential operations, administrative actions, and data mutation.
8. Unknown authentication state or unknown direct-reachability state **MUST** block deployment.
9. Every critical endpoint **MUST** have a negative-auth test that expects denial.
10. Tests and configuration **MUST NOT** contain real credentials.
11. Authentication success **MUST NOT** imply authorization success; least-privilege authorization **SHOULD** be reviewed separately.
12. High-risk auth changes **MUST** receive independent verification by someone other than the implementer.
13. Exceptions **MUST** have owner, scope, rationale, expiry, and approval; exceptions **MUST NOT** suppress observed anonymous critical access.