# Rules: OAuth Scope Integrity

1. Explicit operator-required scopes MUST NOT be silently deleted by server metadata, SDK defaults, refresh handling, or step-up handling.
2. Required, desired, granted, challenged, and supported scopes MUST remain separately attributable in diagnostics.
3. Runtime step-up authorization MUST union newly required challenge scopes with still-valid previously granted scopes unless an explicit policy requires re-consent with a different set.
4. A client MUST NOT claim refresh survivability merely because `offline_access` was requested; refresh-token issuance MUST be observed.
5. If non-interactive operation requires refresh capability, losing `offline_access` before authorization MUST block completion when the authorization server advertises that scope.
6. Unsupported required scopes MUST block authorization preflight rather than being silently removed.
7. Server-advertised `scopes_supported` SHOULD constrain compatibility checks, but MUST NOT be treated as operator intent.
8. Credentials, authorization codes, access tokens, refresh tokens, and client secrets MUST NOT be written to package evidence or test fixtures.
9. Scope mutations SHOULD be logged as before/after sets with provenance, never as raw credential-bearing request dumps.
10. A high-risk auth change MUST be independently verified by an agent/person other than the implementer before production rollout.
