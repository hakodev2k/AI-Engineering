# Time-Series Rules

## Purpose
Preserve temporal correctness in quantitative research and production calculations.

## Scope
Applies to timestamped observations, bars, events, curves, forecasts, features, and labels.

## MUST
- Event time, observation time, publication time, and processing time MUST be distinguished whenever they can differ materially.
- Features MUST use only information legitimately available at the decision timestamp.
- Resampling, interpolation, forward filling, lagging, and alignment MUST have explicit semantics and tests.
- Trading calendars, holidays, daylight-saving transitions, session boundaries, and timezone conversions MUST be handled deterministically.
- Temporal joins MUST define inclusion boundaries and tie-breaking behavior.

## MUST NOT
- Future observations MUST NOT leak into historical features or labels.
- End-of-period values MUST NOT be treated as known before their actual availability.
- Unsorted or duplicate timestamps MUST NOT be silently accepted when order affects results.

## SHOULD
- Store canonical timestamps in an unambiguous standard while retaining source-time metadata where useful.
- Test boundary conditions around session opens, closes, month ends, rolls, and clock changes.

## Exceptions
Exceptions require evidence that temporal ambiguity cannot affect the intended decision, plus documented risk and reviewer approval.

## Verification
Run leakage tests, timestamp-order checks, calendar tests, temporal-join fixtures, and manual spot checks around known boundary events. Reproduce sample calculations using only data available at each historical decision time.