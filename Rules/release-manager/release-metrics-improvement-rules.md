# Release Metrics and Improvement Rules

## Purpose
Use release outcomes to improve delivery safety, speed, predictability, and governance without rewarding metric gaming.

## Scope
Applies to release performance measures, retrospectives, recurring failure patterns, and process improvement.

## MUST
- Metrics MUST have defined meaning, data source, scope, and known limitations before being used for decisions.
- Release outcomes MUST distinguish deployment frequency or speed from failure, recovery, customer impact, and escaped defects.
- Material release failures and recurring near misses MUST produce corrective actions with owners and verification criteria.
- Process changes claimed as improvements MUST be supported by before/after evidence or another explicit evaluation method.
- Metrics MUST be interpreted in context rather than used as isolated performance targets.

## MUST NOT
- Teams MUST NOT be incentivized to hide rollbacks, incidents, failed gates, or emergency changes to improve reported metrics.
- A single aggregate metric MUST NOT override material safety or quality evidence.
- Correlation MUST NOT be presented as proven causation without supporting analysis.

## SHOULD
- Trends SHOULD be reviewed over a meaningful period and segmented by risk class or product context where useful.
- Improvement work SHOULD target systemic causes rather than adding approvals indiscriminately.

## Exceptions
Alternative evidence may be used when quantitative data is unavailable; limitations, reasoning, and expected verification must be documented.

## Verification
Inspect metric definitions, source data, trend calculations, retrospective records, corrective actions, and evidence that completed improvements changed the intended outcome.