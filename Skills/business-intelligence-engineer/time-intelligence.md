# Time Intelligence

## Purpose
Implement correct period, calendar, cohort, and point-in-time analytics across business reporting.

## When to use
Use for YTD/MTD, prior-period, fiscal calendars, rolling windows, snapshots, cohorts, and period-over-period comparisons.

## Inputs
Calendar rules, fiscal periods, timezone, event timestamps, snapshot semantics, metric additivity, business cutoffs.

## Context to inspect
Inspect date dimensions, source timezone/storage, fiscal exceptions, late data, daylight-saving behavior, and existing period definitions.

## Core knowledge
Time semantics are business semantics. Event time, processing time, effective time, and snapshot date are distinct. Semi-additive measures such as balances require different aggregation than flows.

## Procedure
1. Identify which timestamp represents the business event.
2. Establish reporting timezone and cutoff rules.
3. Use a governed calendar/date dimension including fiscal attributes.
4. Define complete versus partial period behavior.
5. Implement prior-period comparisons using comparable windows.
6. Handle balances/snapshots with appropriate last-valid-value semantics.
7. Define cohort entry and aging rules explicitly.
8. Account for late-arriving events and restatements.
9. Test leap years, year boundaries, DST, 53-week years, and incomplete periods where relevant.
10. Document interpretation alongside measures.

## Decision points
Use calendar comparisons for calendar-driven business questions; use equal-length rolling windows for operational trend questions. Do not compare partial current periods with full historical periods unless clearly intended.

## Common failure patterns
UTC/local mixing, naive date subtraction for fiscal periods, summing balances, hidden partial periods, and inconsistent week definitions.

## Verification
Validate against hand-calculated boundary examples and historical known periods; reconcile totals across daily, monthly, and fiscal views.

## Expected output
Consistent time model, reusable calculations, documented period semantics, and boundary tests.

## Stop conditions
Stop when fiscal/calendar ownership is unresolved or source timestamps cannot be interpreted reliably.