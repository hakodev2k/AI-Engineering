# Log Data Safety Rules

## MUST
- Identify logging sinks affected by the change.
- Keep credentials, bearer tokens, passwords, private keys, cookies, and raw secret values out of logs.
- Use sanitized synthetic fixtures for tests.
- Run deterministic log scanning on representative outputs.
- Preserve evidence for any approved sensitive-data exception.
- Have an independent verifier review high-risk logging changes.

## MUST NOT
- Copy production secrets or raw customer data into tests, prompts, fixtures, or incident artifacts.
- Log entire request/response/domain objects by default when they can contain sensitive fields.
- Disable the gate to make CI pass.
- Treat hashing as automatically safe for low-entropy secrets or identifiers.
- Increase production observability permissions to gather evidence without approval.
- Deploy production, change secrets/config, delete data, weaken security, or rewrite Git history without explicit approval.

## SHOULD
- Prefer explicit safe-field projection.
- Centralize reusable redaction.
- Keep correlation IDs distinct from authentication/session tokens.
- Test both text and structured logging paths where used.