# Correlation Rules

## Purpose
Ensure multi-event detections correlate evidence accurately across time, systems, and identities.

## Scope
Applies to sequence rules, joins, entity correlation, graph logic, and cross-source detections.

## MUST
- Correlation keys MUST have documented identity semantics and collision risks.
- Time windows MUST be justified by attack behavior and telemetry latency.
- Correlation logic MUST define ordering requirements, missing-event behavior, and duplicate handling.
- Cross-source joins MUST account for clock skew, normalization differences, and delayed ingestion.

## MUST NOT
- MUST NOT join events on ambiguous display names when stable identifiers are available.
- MUST NOT treat temporally adjacent events as causally related without supporting context.
- MUST NOT silently discard partial chains that may still carry security value.

## SHOULD
- Correlations SHOULD use independent signals that materially increase confidence.
- Complex chains SHOULD emit enough contributing evidence for analysts to understand why the alert fired.

## Exceptions
Exceptions require documented limitations, risk, alternative logic, and review approval.

## Verification
Use synthetic sequences, reordered and delayed events, duplicate fixtures, identity-collision cases, and analyst review of resulting evidence.