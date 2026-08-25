# Time-Series Visualization

## Purpose
Design trustworthy temporal views that expose trends, seasonality, change points, gaps, and comparisons.

## When to use
For metrics indexed by event, business, or reporting time.

## Inputs
Timestamp semantics, timezone, cadence, aggregation grain, comparison periods, missing-data rules.

## Core knowledge
Temporal aggregation changes conclusions. Calendar boundaries, daylight saving, incomplete periods, late events, seasonality, and smoothing can all mislead. Comparison windows must be aligned on meaningful business cycles.

## Procedure
1. Confirm timestamp meaning and timezone.
2. Establish native sampling cadence and completeness.
3. Choose aggregation grain appropriate to the decision horizon.
4. Preserve gaps rather than inventing continuity unless imputation is justified.
5. Mark partial periods and data freshness.
6. Add comparison baselines such as prior period or target when relevant.
7. Separate raw values from smoothed trends.
8. Annotate material events only when evidence supports relevance.
9. Test zoomed and long-range behavior.
10. Validate boundary calculations around periods and timezones.

## Decision points
Use lines for continuous temporal progression, bars for discrete periods, and small multiples for many comparable series. Avoid smoothing when anomalies or short-lived incidents matter.

## Common failure patterns
Mixing timezones; comparing incomplete current periods with complete historical periods; excessive series overlap; hidden interpolation; misleading rolling windows; dual-axis correlations.

## Verification
Reconcile selected points to source queries and test boundary dates, missing periods, leap dates, and timezone transitions.

## Expected output
A temporal visualization specification with grain, timezone, completeness, comparisons, missingness, and smoothing rules.

## Stop conditions
Stop if timestamp semantics or incomplete-period treatment cannot be established.