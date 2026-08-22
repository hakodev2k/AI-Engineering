# Rules: MCP OAuth Binding

1. The client **MUST** persist the expected authorization-server issuer and protected resource before redirecting the user to authorize.
2. The callback handler **MUST** validate the returned or selected issuer against the stored expected issuer before redeeming an authorization code.
3. Client credentials **MUST** be scoped to the issuer that created them and **MUST NOT** be reused with another issuer.
4. Access and refresh tokens **MUST** remain bound to the protected resource and issuer recorded when they were obtained.
5. Protected tool execution **MUST** validate token issuer plus audience/resource constraints; signature and expiry checks alone are insufficient.
6. A change in protected-resource metadata that changes the issuer **MUST** invalidate cached authorization state and require reauthorization.
7. Credentials lacking issuer/resource provenance **MUST NOT** be silently upgraded. They **MUST** be reauthorized or migrated using independently verified evidence.
8. Authorization codes, refresh tokens, access tokens, PKCE verifiers, and client secrets **MUST NOT** appear in model context, logs, generated reports, or test snapshots.
9. Redirect URIs **MUST** use HTTPS except loopback/localhost flows explicitly permitted by policy.
10. `state` and PKCE verification **MUST** remain enabled even when issuer validation is present.
11. Authorization failures **MUST** fail closed. Retry **MUST NOT** switch issuers, audiences, or resource identities automatically.
12. Reauthorization loops **MUST** be bounded to two attempts per user action before escalating the exact failure.
13. Production IdP registration or trust-policy changes **MUST** require explicit human approval.
14. The implementation agent **MUST NOT** be the sole verifier of changes affecting token redemption or validation.
15. Security tests **SHOULD** include wrong issuer, wrong audience/resource, stale credential, metadata migration, replay, and missing-provenance fixtures.