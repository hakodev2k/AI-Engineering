# Investigation Safety Rules

## MUST
- Treat logs as evidence, not truth without source and timestamp context.
- Preserve original timestamps and source identifiers when normalizing events.
- Redact configured secret/sensitive keys before evidence is handed to an AI agent.
- Distinguish facts, hypotheses, decisions, and open questions.
- Record confidence as `verified`, `probable`, `possible`, or `inconclusive`.
- Keep production access read-only for this workflow.
- Preserve failed command/query output used to make decisions.
- Stop before any approval-required action.

## MUST NOT
- Do not claim a root cause only because an exception is the last event in a trace.
- Do not modify, delete, rotate, restart, deploy, migrate, or reconfigure production systems.
- Do not paste credentials, tokens, cookies, connection strings, or raw authorization headers into reports.
- Do not widen the investigation window indefinitely; use at most two justified expansions.
- Do not suppress failing tests, reduce assertions, or weaken security controls to validate a fix.
- Do not change a public API contract unless explicitly required and approved.
- Do not use production data mutation as a reproduction technique.

## SHOULD
- Prefer trace/request IDs over timestamp-only correlation.
- Prefer the earliest abnormal event over downstream symptom exceptions.
- Reproduce with sanitized or synthetic data.
- Use focused tests before broad suites.
- Keep the corrective diff minimal and incident-specific.
