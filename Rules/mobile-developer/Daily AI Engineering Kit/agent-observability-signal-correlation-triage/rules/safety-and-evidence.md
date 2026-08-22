# Safety and Evidence Rules

## MUST
- Record the exact investigation window and timezone.
- Separate facts, hypotheses, decisions, and open questions.
- Attach each material finding to a source and observation time.
- Use read-only telemetry queries during triage unless explicit approval exists.
- Redact credentials, tokens, secrets, and unnecessary personal/customer data before sharing evidence.
- Preserve contradicting evidence for every non-trivial hypothesis.
- Require at least two independent signal sources before using `correlated` status, unless a single source is authoritative and the limitation is documented.
- Run `scripts/validate-report.py` before marking the report complete.
- Require explicit human approval before production changes, restarts, rollbacks, traffic shifts, destructive queries, secret changes, or security-control changes.

## MUST NOT
- Treat temporal proximity as proof of causality.
- Change production state merely to test a hypothesis.
- Expand telemetry permissions automatically when access is denied.
- Store raw secrets in reports, examples, prompts, commits, or chat transcripts.
- Hide failed verification, contradictory evidence, or missing telemetry.
- Mark status `verified` unless `verification.result` is `passed`.
- Retry the same failing telemetry/tool operation more than two times.

## SHOULD
- Prefer trace/request/correlation IDs over broad text searches.
- Compare the incident window with a known-good baseline.
- Narrow queries before expanding the time window.
- Prefer reversible, non-destructive verification actions.
- Include deployment/config/feature-flag events when they overlap the symptom window.
- Keep raw evidence immutable and produce a separately redacted copy for handoff.
