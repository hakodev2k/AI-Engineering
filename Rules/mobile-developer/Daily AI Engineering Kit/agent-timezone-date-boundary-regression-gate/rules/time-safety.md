# Time Safety Rules

## MUST
- Classify each temporal value as instant, local date, local datetime, duration, or recurrence before modifying logic.
- Make business timezone explicit for date grouping, daily cutoffs, expiry, and scheduling rules.
- Preserve canonical storage semantics and verify API/storage round trips.
- Test day/month/year boundaries and relevant DST transitions.
- Record exact timestamps, zone IDs, and expected/actual results as evidence.
- Require explicit human approval before database schema changes, production configuration/deployment, data rewrites, or breaking API changes.

## MUST NOT
- Use server local time as an implicit business clock.
- Replace timezone conversion with fixed-hour offset arithmetic when civil-time rules are required.
- Truncate an instant to a date before converting to the intended business timezone.
- Treat `DateTimeKind.Unspecified` or equivalent ambiguous values as UTC/local without contract evidence.
- Change production timezone settings or rewrite stored timestamps to make tests pass without approval.
- Log secrets or sensitive user data while collecting temporal evidence.

## SHOULD
- Prefer UTC for stored instants and IANA/OS timezone identifiers for conversion.
- Prefer half-open instant intervals `[start, end)` for time-range filtering where compatible with the contract.
- Inject a clock/time provider into deterministic business logic rather than reading wall-clock time directly.
- Keep local-date-only concepts as dates instead of manufacturing midnight instants prematurely.
- Add regression tests with explicit zone IDs rather than relying on the machine's local timezone.
