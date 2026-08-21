# Authorization Boundary Rules

- The server **MUST** authenticate the principal before creating or resuming a stateful session.
- The server **MUST** validate issuer and the expected MCP audience/resource indicator; a token valid for another application **MUST NOT** be accepted.
- Every stateful session **MUST** be bound to an authenticated principal. Possession of a session ID **MUST NOT** authorize use of that session.
- Every tool **MUST** have an explicit policy entry. Missing policy, claims, resource ownership, or grants **MUST** deny execution.
- Tool authorization **MUST** be checked immediately before execution, not only at login or tool discovery.
- Server-wide backend credentials **MUST NOT** be treated as evidence that the caller is authorized.
- High-risk or irreversible tools **MUST** require explicit human approval when policy says so; approval **MUST** identify the principal, resource, tool, and action being approved.
- The LLM **MUST NOT** decide whether a security check can be skipped.
- Authorization failures **SHOULD** log decision metadata without bearer tokens, secrets, or sensitive payloads.
- Cross-principal, cross-session, cross-resource, wrong-audience, missing-grant, and missing-approval tests **MUST** pass before release.
- A security test **MUST NOT** be made green by broadening grants, disabling audience validation, sharing sessions, or changing fail-closed behavior.
