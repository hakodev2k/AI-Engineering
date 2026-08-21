# Time Dependency Governance

## MUST
- Represent decision timestamps as timezone-aware ISO-8601 values and normalize comparisons to UTC.
- Record `source_id`, `trust_level`, `observed_at_utc`, `clock_skew_ms`, and `observation_id` for every time-sensitive decision.
- Re-evaluate time immediately before a side effect when the prior observation exceeds the risk-specific freshness limit.
- Use a verified reference source for high/critical risk decisions.
- Bind independent review to the exact decision fingerprint for high/critical risk work.
- Preserve the previous observation/evaluation when refreshing evidence.
- Require explicit human approval before production deployment, destructive operations, secret/config changes, irreversible migrations, or other dangerous actions.

## MUST NOT
- Treat naive local timestamps as authoritative.
- Infer timezone from developer location, repository location, or machine locale.
- Reuse an expired observation to avoid re-querying time.
- Mark a local system clock `verified` unless a reference source was actually checked.
- Silently widen maintenance windows or expiration thresholds.
- Retry validation, permission, or business-rule failures as transient failures.
- Let the executor be the sole reviewer for high/critical risk decisions.

## SHOULD
- Prefer UTC storage with IANA timezone names retained for business interpretation.
- Use monotonic time for elapsed-duration measurement and wall-clock UTC for calendar deadlines.
- Keep retries to one attempt for transient time-source/tool failures.
- Record why a time decision was blocked or revalidated.
