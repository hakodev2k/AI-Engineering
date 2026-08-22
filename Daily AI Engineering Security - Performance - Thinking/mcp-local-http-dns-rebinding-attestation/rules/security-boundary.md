# Rules: MCP Local HTTP Security Boundary

1. Local HTTP MCP servers **MUST** validate effective `Host` and `Origin` values against explicit policy.
2. A server intended to be local-only **MUST** bind to loopback and **MUST NOT** bind `0.0.0.0` or `::` unless a reviewed public-server policy exists.
3. Servers exposing sensitive capabilities **MUST** require authentication even when bound to loopback.
4. Foreign Host and Origin probes **MUST** be rejected before MCP tool execution.
5. Security validation **MUST** be tested against the effective deployed endpoint, not inferred solely from SDK version or source configuration.
6. Operators **MUST NOT** treat a browser same-origin policy as a security boundary for localhost services.
7. Reverse proxies **MUST** preserve or independently enforce the Host/Origin policy; proxy deployment **MUST NOT** silently disable downstream validation.
8. Probe automation **MUST NOT** invoke state-changing tools.
9. High-impact tool surfaces **MUST** be included in the exposure assessment: shell, filesystem write, browser control, CI/CD mutation, secrets, and cloud administration.
10. A successful foreign Host/Origin probe **MUST** block release/startup verification until remediated or an explicitly reviewed architecture demonstrates an equivalent boundary.
11. Dependency upgrades **SHOULD** follow vendor-fixed versions, but version compliance **MUST NOT** substitute for runtime attestation.
12. Attestation output **MUST** avoid secrets, request tokens, tool-result bodies containing sensitive data, or credential-bearing URLs.
13. Transient network failures **MAY** be retried at most twice; repeated ambiguity **MUST** escalate to manual review.
14. Security controls **MUST NOT** be weakened to improve latency or local development convenience.
