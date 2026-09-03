# Transport Security Rules

- Streamable HTTP MCP servers **MUST** validate the effective `Host` before JSON-RPC parsing or dispatch.
- Browser-originated requests **MUST** have an `Origin` that exactly matches an explicit allowlist after canonical normalization.
- Production `allowed_hosts` and `allowed_origins` **MUST NOT** contain `*`.
- A loopback bind **MUST NOT** be treated as sufficient DNS-rebinding protection.
- Native clients without `Origin` **MAY** be accepted only when `allow_missing_origin` is an explicit policy decision and Host/bind checks still pass.
- Forwarded host/origin headers **MUST NOT** be trusted unless the immediate peer is in an explicit trusted-proxy list.
- The application **MUST** reject ambiguous, malformed, multi-valued, CR/LF-containing, userinfo-containing, or path-bearing Host/Origin metadata.
- Rejected requests **MUST** stop before tool/resource/prompt dispatch and **SHOULD** emit a structured, secret-free rejection reason.
- Authentication **MUST NOT** replace Host/Origin validation.
- SDK upgrades, proxy changes, listener changes, and browser integrations **MUST** rerun the regression suite.
- High-impact tools (shell, filesystem write, credential access, deployment) **SHOULD** retain independent authorization even after the transport gate passes.
- Security verification **MUST** be performed by someone or something independent of the implementation change for high-risk deployments.
