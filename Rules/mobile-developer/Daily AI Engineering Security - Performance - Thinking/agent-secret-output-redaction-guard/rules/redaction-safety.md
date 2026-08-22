# Secret Output Redaction Safety Rules

- Redaction MUST occur before output is logged, persisted, streamed, or returned to a model.
- Secret values MUST come only from explicitly configured environment-variable names; the guard MUST NOT enumerate the entire environment.
- Configuration, reports, errors, and tests MUST NOT contain real secret values.
- Known-value masking MUST run before pattern masking.
- A redaction failure MUST fail closed for persistence and model reinjection.
- Raw output MUST NOT be retained as a fallback when sanitization fails.
- Command preflight MUST be treated as defense in depth, not as a shell sandbox or authorization decision.
- High-risk dump commands SHOULD be replaced with targeted lookups that reveal only names, presence, or sanitized metadata.
- Any credential disclosed before the guard was active MUST be rotated; post-hoc masking is insufficient.
- Tests MUST use synthetic credentials that cannot authenticate to any service.
