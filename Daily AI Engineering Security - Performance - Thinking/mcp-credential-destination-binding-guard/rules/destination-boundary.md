# Rules — Credential Destination Boundary

- Credential-bearing requests MUST be authorized against a normalized destination before credentials are attached.
- A credential class MUST have an explicit destination policy; missing policy MUST deny.
- Dynamic destinations MUST NOT be authorized by model judgment alone.
- HTTPS MUST be required for credential-bearing requests unless a separately reviewed protocol explicitly replaces TLS.
- URL userinfo MUST NOT be accepted for credential-bearing destinations.
- Raw IP literals MUST NOT be accepted unless explicitly required and separately allowlisted.
- Allowed ports MUST be explicit.
- Host matching MUST occur on a normalized lowercase hostname with trailing dot removed.
- Suffix matching MUST preserve label boundaries and MUST NOT allow lookalike hosts such as `mq.amazonaws.com.attacker.example`.
- Redirects MUST be disabled or the redirect target MUST be re-authorized before forwarding credentials.
- Credentials MUST NOT be copied across origins automatically.
- Human approval, when required, MUST bind operation, normalized destination, and credential class.
- Approval MUST be invalidated when any bound field changes.
- Logs MUST include the policy decision and normalized destination but MUST NOT contain secret values or authorization headers.
- Security regression tests MUST include attacker-controlled hostnames, userinfo, non-TLS schemes, disallowed ports, raw IPs, lookalike domains, and redirect attempts.
- High-risk changes SHOULD receive independent review by someone other than the implementer.
- Failure or parser ambiguity MUST default to deny.
