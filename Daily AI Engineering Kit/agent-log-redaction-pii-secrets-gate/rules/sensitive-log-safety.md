# Sensitive Log Safety Rules

## MUST
- Sanitize logs and tool output before sending them to an LLM or shared engineering artifact.
- Use the narrowest feasible time range, service scope, and fields.
- Run `scripts/redact_logs.py` with the repository policy before handoff.
- Treat exit code `0` as sanitized, `2` as blocked-sensitive-input, and any other non-zero result as gate failure.
- Preserve source metadata needed for traceability without copying matched secret values.
- Re-scan sanitized output before final handoff when the evidence is high risk.
- Require explicit approval before weakening blocked detectors, expanding allowlists materially, or changing raw-log retention behavior.

## MUST NOT
- Paste raw production logs, authorization headers, connection strings, private keys, access tokens, or customer payloads into agent prompts.
- Store real secrets in examples, tests, configuration, issues, PRs, or redaction reports.
- Log the matched sensitive value while reporting a finding.
- Disable the gate because a detector is inconvenient.
- Automatically increase log-system permissions, retention, or export scope.
- Claim that regex redaction guarantees compliance or complete de-identification.
- Delete original evidence or production logs without explicit authorization and applicable retention rules.

## SHOULD
- Prefer structured logging fields over free-form payload dumps.
- Disable or hash high-cardinality personal identifiers at the source when full values are not needed operationally.
- Keep raw evidence in its original controlled system and export only a minimized slice.
- Use synthetic fixtures for detector regression tests.
- Review redaction policy when new authentication formats, vendors, or data classes are introduced.
