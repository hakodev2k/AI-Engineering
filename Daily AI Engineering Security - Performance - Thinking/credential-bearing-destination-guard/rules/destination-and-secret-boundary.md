# Destination and Secret Boundary Rules

- Credential-bearing network requests **MUST** pass deterministic destination authorization immediately before send.
- A model-provided hostname or URL **MUST NOT** be treated as trusted merely because the tool itself is approved.
- Services with authoritative discovery APIs **SHOULD** derive destinations from stable identifiers such as resource ID + region instead of accepting a free-form URL from the model.
- Credential-bearing requests **MUST** use an allowlisted scheme, host policy, and port.
- Automatic redirects **MUST NOT** be followed for credential-bearing requests unless every redirect target is independently re-authorized and credentials are stripped by default.
- Resolved loopback, private, link-local, multicast, unspecified, or otherwise non-global addresses **MUST** be rejected unless an explicit internal-service policy exists outside the model-controlled request.
- URL userinfo **MUST NOT** be accepted.
- Approval **MUST** be bound to normalized destination, credential class, and operation; approval for one destination **MUST NOT** authorize another.
- Secrets **MUST NOT** be written to logs, prompts, error messages, or approval descriptions.
- A failed guard **MUST** block the request; callers **MUST NOT** downgrade to an unguarded client.
- Network egress policy **SHOULD** independently deny unauthorized destinations even when application validation succeeds.
- DNS/endpoint validation **MUST** account for rebinding and TOCTOU; where practical, use trusted service discovery and connect only to its resolved endpoint.
- High-risk exceptions **MUST** require explicit human approval and documented expiry.
- Credential rotation **MUST** be triggered when evidence indicates a secret may already have been sent to an unauthorized endpoint.
