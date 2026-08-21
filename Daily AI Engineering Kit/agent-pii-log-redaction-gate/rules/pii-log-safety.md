# PII Log Safety Rules

## MUST
- Treat detected credentials, tokens, connection-string secrets, payment-card values, and authentication artifacts as blocking findings.
- Record findings using type, severity, file, and line; replace the detected value with `[REDACTED]` in reports.
- Prefer preventing sensitive data at the logging source over post-processing already-emitted logs.
- Run deterministic scanning after logging, telemetry, exception-handling, HTTP middleware, serialization, or diagnostics changes.
- Keep allowlist entries narrow, documented, and evidence-based.
- Preserve enough non-sensitive correlation context to debug failures.
- Require independent verification for high or critical findings.

## MUST NOT
- Paste raw sensitive findings into prompts, issues, PR descriptions, comments, screenshots, or generated reports.
- Commit production logs containing personal or secret data.
- Mark a finding safe solely because it appears in a development environment.
- Add broad regex or directory exclusions merely to make the gate pass.
- Store secrets in the policy file, test fixtures, examples, or README.
- Disable security controls, retention protections, or access controls without explicit human approval.
- Upload raw incident evidence to an external AI/tool unless the organization explicitly permits it.

## SHOULD
- Use structured logging and an explicit field allowlist for user/request objects.
- Log opaque identifiers instead of names, email addresses, access tokens, or full payloads.
- Test redaction with realistic but synthetic fixtures.
- Review logging at trust boundaries: HTTP, queues, external APIs, databases, authentication, and exception middleware.
- Treat recurring false positives as a policy-quality problem and fix them with scoped patterns or literals.
