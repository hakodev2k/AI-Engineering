# Error Forwarding Rules

- MCP servers/hosts MUST treat raw exception text and downstream error bodies as untrusted sensitive data.
- They MUST NOT forward stack traces, environment values, raw SQL, filesystem paths, Authorization headers, cookies, tokens, or unrestricted downstream response bodies to model-visible error content.
- Every model-visible error MUST use a bounded public error envelope with a stable `code`, safe `message`, retry classification, and correlation ID.
- Detailed diagnostics MUST be stored only in an approved operator channel with access controls and retention policy.
- Error sanitization MUST run after raw failure capture and before model/context forwarding.
- Registered secrets MUST be removed by exact-value matching in addition to pattern-based detection.
- Error payloads MUST have a configured byte/character limit.
- Sanitization failures MUST fail closed with a generic safe error rather than forwarding raw data.
- The system SHOULD preserve non-sensitive structured details that materially improve safe retry.
- Logs MUST NOT contain raw registered secrets and MUST NOT be copied wholesale back into model context.
- Security tests MUST include synthetic secret, PII, stack trace, path, SQL, and downstream-body fixtures.
- The implementing component MUST NOT be the only verifier for high-risk integrations.
- Retry loops MUST be bounded; an error message MUST NOT instruct the agent to weaken permissions or reveal secrets to continue.