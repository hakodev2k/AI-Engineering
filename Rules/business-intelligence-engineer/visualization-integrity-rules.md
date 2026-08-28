# Visualization Integrity Rules

## Purpose
Prevent charts and visual encodings from distorting analytical meaning.

## Scope
Applies to charts, tables, scorecards, maps, and visual comparisons.

## MUST
- Visual encodings MUST preserve the quantitative relationship they claim to show.
- Truncated axes, dual axes, normalization, and logarithmic scales MUST be disclosed when they can change interpretation.
- Color or size encoding MUST have a documented semantic meaning when used to drive decisions.
- Comparative visuals MUST use compatible populations, periods, and units unless differences are explicit.

## MUST NOT
- MUST NOT manipulate axis ranges or aggregation solely to exaggerate a trend.
- MUST NOT encode critical distinctions using color alone when accessibility requires another cue.

## SHOULD
- Visuals SHOULD minimize non-data decoration and emphasize uncertainty or exceptional conditions when material.

## Exceptions
Exceptions require documented analytical purpose and review for interpretive risk.

## Verification
Inspect chart configuration, axes, aggregations, legends, accessibility behavior, and source values.