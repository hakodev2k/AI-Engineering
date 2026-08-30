# Detection System Rules

## Purpose
Require abuse-detection systems to be measurable, calibrated, explainable enough for operations, and safe to use for enforcement.

## Scope
Applies to classifiers, heuristics, rules engines, graph signals, anomaly detectors, scoring systems, and signal ensembles.

## MUST
- Each detector MUST define the abuse behavior it targets, input dependencies, output semantics, expected operating range, and known blind spots.
- Thresholds used for enforcement MUST be supported by evaluation evidence appropriate to the affected population and harm severity.
- Precision, recall, false-positive rate, false-negative risk, and calibration MUST be assessed where the labels permit those measurements.
- Detection changes MUST be evaluated against representative recent data and important historical incidents.
- High-impact enforcement MUST combine detection confidence with policy context and required review safeguards.
- Detector dependencies and feature freshness MUST be monitored so stale or missing signals do not silently change enforcement behavior.

## MUST NOT
- MUST NOT interpret a detector score as a probability unless it is actually calibrated and documented as such.
- MUST NOT deploy a detector whose failure mode can cause broad irreversible enforcement without containment controls.
- MUST NOT train and evaluate on contaminated splits that leak the same entities, events, or labels across boundaries.
- MUST NOT hide known performance disparities or blind spots from decision owners.

## SHOULD
- Detectors SHOULD expose reason features or interpretable evidence where operational review depends on them.
- Ensembles SHOULD reduce correlated failure rather than duplicate the same weak signal.
- Thresholds SHOULD be adjustable independently from model deployment when safe governance permits.

## Exceptions
Emergency heuristics MAY be deployed during active abuse spikes with explicit expiry, conservative action scope, monitoring, and human ownership.

## Verification
Review detector specifications, evaluation reports, calibration plots, threshold rationale, feature freshness alerts, sampled decisions, and rollback configuration. Confirm production metrics match the documented operating assumptions.