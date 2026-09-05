# Retention and Lifecycle Rules

## Purpose
Control how long telemetry is retained and when it is archived, compacted, or deleted.

## Scope
Logs, metrics, traces, events, raw payloads, derived telemetry, archives, and deletion workflows.

## MUST
- Retention periods MUST be defined by operational need, legal or policy obligations, sensitivity, and cost.
- High-sensitivity telemetry MUST have the shortest retention consistent with legitimate requirements.
- Deletion and expiration mechanisms MUST be testable and observable.
- Changes to retention that affect investigations, compliance, or SLO analysis MUST undergo impact review.

## MUST NOT
- MUST NOT retain telemetry indefinitely by default.
- MUST NOT extend retention of sensitive data merely because storage is available.
- MUST NOT disable lifecycle controls without documented approval.

## SHOULD
- Use tiered storage or aggregation when historical value remains but raw detail is no longer necessary.

## Exceptions
Require documented requirement, data classification, cost, risk, duration, and approval where material.

## Verification
Inspect lifecycle policies, storage configuration, deletion tests, retention dashboards, and policy records.