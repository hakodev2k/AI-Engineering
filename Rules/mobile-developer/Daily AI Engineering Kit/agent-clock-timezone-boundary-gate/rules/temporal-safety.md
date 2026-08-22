# Temporal Safety Rules

## MUST
- Classify each affected temporal value as instant, local date/time, date-only, duration, or recurring schedule before editing its logic.
- Use an explicit business time zone for local business rules.
- Store/compare instants consistently; preserve offsets or UTC markers at serialization boundaries.
- Make range inclusivity explicit and test both boundaries.
- Test DST gaps/overlaps when the configured zone can observe DST and local wall time affects behavior.
- Preserve evidence for every claimed temporal defect.
- Run the temporal scan and relevant automated tests before declaring verification.
- Require explicit human approval for persistence representation changes, production scheduler changes, data migrations, public contract changes, or production configuration changes.

## MUST NOT
- Use machine-local time as a substitute for an explicit business zone.
- Treat an unspecified local timestamp as a confirmed instant.
- Convert a date-only business concept to UTC midnight and assume the business date is preserved globally.
- Add/subtract fixed 24-hour periods to represent a local calendar day when DST may matter.
- Silently choose one offset for an ambiguous local time without a documented policy.
- Silently normalize an invalid local time without a documented policy.
- Modify production data, schedules, secrets, infrastructure, or schema without approval.
- Disable or weaken failing temporal tests to pass verification.

## SHOULD
- Inject a clock/time provider instead of reading wall time directly in domain logic.
- Keep conversion at system boundaries and domain semantics explicit.
- Prefer half-open ranges `[start, end)` for adjacent time windows when compatible with requirements.
- Include the zone identifier and resolved offset in diagnostic evidence when safe.