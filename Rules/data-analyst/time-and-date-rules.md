# Time and Date Rules

## Purpose
Prevent errors caused by ambiguous periods, time zones, and incomplete intervals.

## Scope
Time-series analysis, period comparisons, cohorts, retention, and reporting calendars.

## MUST
- Define timezone, calendar, period boundaries, and inclusion rules.
- Distinguish event time from processing or ingestion time when relevant.
- Treat incomplete current periods explicitly.
- Normalize daylight-saving and timezone conversions consistently.
- Use comparable period lengths for trend comparisons unless differences are disclosed.

## MUST NOT
- MUST NOT mix local and UTC timestamps without controlled conversion.
- MUST NOT compare partial periods to complete periods as equivalent.

## SHOULD
- Use a governed date dimension for fiscal, holiday, and reporting-calendar logic.

## Exceptions
Exploratory comparisons may use simplified calendars if the simplification cannot materially affect conclusions.

## Verification
Inspect boundary cases, timezone conversions, period completeness, and sample records around calendar transitions.