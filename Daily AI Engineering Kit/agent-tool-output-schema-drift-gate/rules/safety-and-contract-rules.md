# Safety and Contract Rules

## MUST
- Validate tool output before using fields that control writes, retries, approvals, permissions, or completion.
- Preserve a redacted raw response as evidence for every detected breaking drift.
- Keep provider-specific parsing inside a boundary adapter.
- Treat missing required fields, incompatible types, and unknown control statuses as blocking validation failures.
- Keep retries bounded to two tool-call retries and two implementation/test retries.
- Require an independent Verification Agent after implementation.
- Require explicit human approval before production deployment, secret/config changes, breaking API changes, permission expansion, destructive operations, or weakening validation.

## MUST NOT
- Do not guess missing identifiers, success states, permissions, timestamps, or approval results.
- Do not convert a validation failure into success because downstream work appears plausible.
- Do not log secrets, tokens, credentials, authorization headers, or unredacted sensitive payloads.
- Do not accept arbitrary additional statuses when status drives agent behavior.
- Do not disable schema validation to unblock a run.
- Do not force push, rewrite history, or perform destructive recovery.

## SHOULD
- Prefer additive canonical schemas and narrow adapters over provider-specific logic in workflows.
- Keep old known-good fixtures to detect accidental backward incompatibility.
- Pin schema versions where the provider supports versioning.
- Separate facts, hypotheses, decisions, and open questions in drift reports.