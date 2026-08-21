# Log Redaction Safety Rules

## MUST
- Classify logged fields before changing redaction behavior.
- Use synthetic sentinel values for secret/PII verification.
- Preserve required correlation identifiers such as trace/request/correlation IDs.
- Verify nested objects, arrays, casing variants, and exception paths.
- Record evidence without reproducing sensitive values.
- Bound automated retry/test reruns to two transient attempts.
- Require explicit approval for production config, secret, sink, deployment, or security-control changes.

## MUST NOT
- Log authorization headers, cookies, access/refresh tokens, passwords, private keys, connection strings, or raw secret-bearing configuration.
- Copy real production secrets or PII into tests, examples, prompts, commits, or assessment artifacts.
- Disable security/audit logging globally to eliminate a leakage finding.
- Remove correlation fields solely to simplify redaction.
- Treat scanner output alone as confirmed leakage.
- Change production retention, sink routing, or security controls without approval.

## SHOULD
- Prefer structured property redaction before serialization over regex-only post-processing.
- Use allowlists for high-risk payload logging where practical.
- Fully redact secrets; use approved masking/tokenization only for PII when business requirements need it.
- Test failure and exception paths because they often serialize more context than successful paths.
- Keep redaction rules centralized and covered by deterministic tests.
